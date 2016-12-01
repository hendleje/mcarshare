/**
 * Module dependencies.
 */

var express = require('express'), http = require('http'), path = require('path'), fs = require('fs'), Customer = require('./routes/customer'), Car = require('./routes/car'), Location = require('./routes/location'), Rentalagreement = require('./routes/rentalagreement'), Bill = require('./routes/bill');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://mcarshare4%40gmail.com:stutter1@smtp.gmail.com');



var app = express();
var currentcar, currentuser, rentalagreement;
var count = 0;

var link = "http://localhost:3343/";

// all environments
app.set('port', process.env.PORT || 3343);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/index", function(req, res) {
	res.render("index");
});

app.get('/', function(req, res) {
	res.render("index");
});

app.get("/signin", function(req, res) {
	res.render("signin");
});

app.get("/logout", function(req, res) {
	// Delete reservation of car
	if (typeof currentcar != "undefined") {
		if (currentcar.status = "reserved") {
			currentcar.changestatus("available");
		}
	}
	
	currentuser = undefined;
	currentcar = undefined;
	rentalagreement = undefined;
	res.render("signin", {
		info : 'You are successfully logged out.\n'
	});
});

app.get("/registernewuser", function(req, res) {
	res.render("registernewuser");
});

app.get("/searchresults", function(req, res) 
		{
			if (typeof currentuser == 'undefined') 
			{
				res.render("signin", {
					info : 'Please sign in to view search results.'
				});
			} 
			else 
			{
				fs.readFile(__dirname + '/public/cardata.json', 'utf8', function(err,
						data) 
					{
						if (err)
							throw err;
						var cardata = JSON.parse(data);
						var table = '<tr><th style ="text-align:"left">Picture</th><th>Class</th>';
						table += '<th>Car Model</th><th>Distance</th><th>Price per km</th><th>Price per hr</th><th>Rent</th></tr>';
						var rows = cardata.length;
						var cols = 7;		 				 
						for (var r = 0; r < rows; r++) {
							table += '<tr>';
							for (var c = 1; c <= cols; c++) {
								if (c == 1) {
									table += '<td><img src="'+cardata[r].picture+'"<align="left"></td>';
								}
								if (c == 2) {
									table += '<td>'+ cardata[r].carclass+'</td>';
								} else if (c == 3) {
									table += '<td>'+ cardata[r].model+'</td>';
								} else if (c == 4) {
									table += '<td><font size="5" color="green">'+ cardata[r].distance+'</font></td>';
								} else if (c == 5) {
									table += '<td><font size="10" color="Black">$ '+ cardata[r].kmcost+'</font> / km</td>';
								} else if (c == 6) {
									table += '<td><font size="10" color="Black">$ '+ cardata[r].timecost+'</font> / 1h</td>';
								} else if (c == 7) {
									table += '<td><form id=car"' + cardata[r].id + '" action="cardetails" method = "post"><fieldset><input type="text"' ;
									table += 'id="carid" name="carid" value="' + cardata[r].id + '" style="display: none";/>';
									table+= '<input type="submit"  value="View details/ Reserve car"/><fieldset></form></td>';
								}
							}
							table += '</table>';
						}
						if (cardata[0].status == 'available') 
						{
							res.render("searchresults", {
								firstName : currentuser.firstname,
								lastName : currentuser.lastname,
			//					picture : cardata[0].picture,
			//					carclass : cardata[0].carclass,
			//					model : cardata[0].model,
			//					distance : cardata[0].distance,
			//					kmprice : cardata[0].kmcost,
			//					hrprice : cardata[0].timecost
								table
							});
						}
						else 
						{
							res.render("searchresults");
						}
					})
			}
		});

app.post("/cardetails", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in to view car details.'
		});
	} else {
		fs.readFile(__dirname + '/public/cardata.json', 'utf8', function(err,
				data) {
			if (err)
				throw err;
			var cardata = JSON.parse(data);
			var i = req.body.carid -1;
			// for (var i = 0; i < cardata.length; ++i) {
			// if (cardata[i].id == idfromcarchosen) {
			currentcar = new Car(cardata[i].id, cardata[i].plate, cardata[i].brand,
					cardata[i].model, cardata[i].color, cardata[i].year,
					cardata[i].category, cardata[i].status, cardata[i].kmcost,
					cardata[i].timecost, cardata[i].creator,
					cardata[i].picture, cardata[i].location,
					cardata[i].description, cardata[i].carclass);
			res.render("cardetails", {
				firstName : currentuser.firstname,
				lastName : currentuser.lastname,
				picture : currentcar.picture,
				description : currentcar.description,
				model : currentcar.model,
				brand : currentcar.brand,
				color : currentcar.color,
				year : currentcar.year,
				plate : currentcar.plate,
				kmprice : currentcar.kmcost,
				hrprice : currentcar.timecost
			});
			// }
			// }
		})
	}
});

app.get("/directiontocar", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in to view directions to car.'
		});
	} else {
		res.render("directiontocar", {
			firstName : currentuser.firstname,
			lastName : currentuser.lastname
		});
	}
});

app.get("/tripdetails", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in to view trip details.'
		});
	} else {
		// Get nice representation of the start and end time
		var starttime = rentalagreement.printdate(rentalagreement.starttime);
		var endtime = rentalagreement.printdate(rentalagreement.endtime);

		res.render("tripdetails", {
			firstName : currentuser.firstname,
			lastName : currentuser.lastname,
			kmcostsum : rentalagreement.cost[0].toFixed(2),
			timecostsum : rentalagreement.cost[1].toFixed(2),
			kmcost : currentcar.kmcost,
			timecost : currentcar.timecost,
			sum : rentalagreement.sum.toFixed(2),
			kmdriven : rentalagreement.kmdriven.toFixed(2),
			timedriven : rentalagreement.timedriven.toFixed(2),
			starttime : starttime,
			endtime : endtime
		});
	}
});

app.get("/tripinformation", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info: "Please sign in to view your trip information."
		})
	}
	else {
		if (currentuser.currentra == "" || typeof currentuser.currentra == 'undefined') {
			res.render("nocurrenttrip", {
				firstname: currentuser.firstname,
				lastname : currentuser.lastname
			});
		}
		else {
			// Load Rental agreement and current car
			var carid;
			
			// Load rental agreement
			var data1 = fs.readFileSync(__dirname + '/public/rentalagreementdata.json', 'utf8')
			var radata = JSON.parse(data1);
			for (var i = 0; i < radata.length; ++i) {
				if (radata[i].customer == currentuser.id && typeof radata[i].endtime == 'undefined') {
					rentalagreement = new Rentalagreement(radata[i].car,
							radata[i].customer, radata[i].id,
							radata[i].starttime);
					carid = radata[i].car;
				}
			}
			
			// Load current car
			var data = fs.readFileSync(__dirname + '/public/cardata.json', 'utf8')
			var cardata = JSON.parse(data);
			for (var i = 0; i < cardata.length; ++i) {
				if (cardata[i].id == carid) {
					currentcar = new Car(cardata[i].id, cardata[i].plate,
							cardata[i].brand, cardata[i].model,
							cardata[i].color, cardata[i].year,
							cardata[i].category, cardata[i].status,
							cardata[i].kmcost, cardata[i].timecost,
							cardata[i].creator, cardata[i].picture,
							cardata[i].location, cardata[i].description,
							cardata[i].carclass);
				}
			}
			res.render("tripinformation", {
				firstName : currentuser.firstname,
				lastName : currentuser.lastname,
				starttime : rentalagreement.printstart(),
				timecost : currentcar.timecost,
				kmcost : currentcar.kmcost
			});
		}
	}
})

app.post("/tripinformation",
		function(req, res) {
			if (typeof currentuser == 'undefined') {
				res.render("signin", {
					info : 'Please sign in to view that page.'
				});
			} else {
				if (typeof rentalagreement == 'undefined') {
					// Set car status to "rented"
					currentcar.changestatus("rented");
					
					// Create rental agreement
					rentalagreement = new Rentalagreement(currentuser.id,
							currentcar.id);
					rentalagreement.save();
					
					// Save rental agreement in customer file
					currentuser.currentra = rentalagreement.id;
					currentuser.changera(rentalagreement.id);
				}

				// Get nice representation of the start and end time
				var starttime = rentalagreement
						.printdate(rentalagreement.starttime);

				res.render("tripinformation", {
					firstName : currentuser.firstname,
					lastName : currentuser.lastname,
					starttime : starttime,
					timecost : currentcar.timecost,
					kmcost : currentcar.kmcost
				});
			}
		});

app.get("/directiontolocation", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in to view directions to location.'
		});
	} else {
		res.render("directiontolocation", {
			firstName : currentuser.firstname,
			lastName : currentuser.lastname
		});
	}
});

app.post("/tripdetails", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in to view trip details.'
		});
	} 
	else {
		// Check, if user at one of the designated locations
		// TODO get correct userlocation
		var userlat, userlong;
		if (count == 0) {
			userlat = -50, 34;
			userlong = 30.33;
			count++;
		} else {
			userlat = 47.564036;
			userlong = -52.708167;
		}
		var atlocation;
		var mindist = (Number.MAX_VALUE) * 2;
		var closestlong = 0;
		var closestlat = 0;
		var closestloc, closestlocname;
		fs.readFile(__dirname + '/public/locationdata.json', 'utf8', function(err, data) {
			if (err)
				throw err;
			var locationdata = JSON.parse(data);
			
			// Calculate distances from designated locations
			for (var i = 0; i < locationdata.length; ++i) {
				current = new Location(locationdata[i].latitude, locationdata[i].longitude);
				var distance = current.distanceto(userlat, userlong);
				if (distance < 10) {
					atlocation = true;
				} else {
					atlocation = false;
				}
				if (distance < mindist) {
					closestlong = current.longitude;
					closestlat = current.latitude;
					closestloc = i;
					closestlocname = locationdata[i].name; 
				}
			}

			// If user is at valid location, return car
			if (atlocation) {
				if (typeof rentalagreement.endtime == 'undefined') {	
					// Finish rental agreement
					rentalagreement.carreturned(10,	currentcar.kmcost, currentcar.timecost);
				}
				
				// Change car status to available and update location of car
				currentcar.changestatusandlocation ("available, closestloc");
				
				// Remove rentalagreement from customer
				currentuser.changera("");
				currentuser.currentra = undefined;

				// Create bill and send it to the user
				bill = new Bill(
						rentalagreement.sum,
						currentuser.id,
						rentalagreement.id);
				bill.sendbillviaemail(currentuser.email);
				currentuser.addbill(bill);
				// Save bill in file
				bill.savebill();

				// Get nice representation of
				// the start and end time
				var starttime = rentalagreement.printdate(rentalagreement.starttime);
				var endtime = rentalagreement.printdate(rentalagreement.endtime);
				
				console.log(currentuser.firstname);
				
				var textformail = "Hello " + currentuser.firstname + " " + currentuser.lastname + ",<br><br>";
				textformail += "Please pay the bill of your last trip by clicking on this ";
				textformail += '<a href = "' + link + 'billpaid/' +bill.id +'"> Link</a><br><br>';
				textformail += "Time of car check out: " + starttime + "<br>";
				textformail += "Time of car return: " + endtime + "<br>";
				textformail += "Time driven: " + rentalagreement.timedriven.toFixed(2) + "h<br>";
				textformail += "Time costs: $" + rentalagreement.cost[0].toFixed(2) + "<br>";
				textformail += "Distance driven: " + rentalagreement.kmdriven.toFixed(2) + "km<br>";
				textformail += "Distance costs: $" + rentalagreement.cost[0].toFixed(2) + "<br>";
				textformail += "Total costs: $" + rentalagreement.sum.toFixed(2) + "<br>";
				textformail += "<br>Thank you,<br>";
				textformail += "the MCarShare-Team"

				
				// Send E-Mail with bill
				var mail_Options = {
					    from: '"MCarshare" <mcarshare4@gmail.com>', // sender address
					    to: ' ', // list of receivers
					    subject: 'Current Bill', // Subject line
					    text: textformail, // html body
					    html: textformail // html body
				};
				mail_Options.to = currentuser.email;
				transporter.sendMail(mail_Options, function(error, info){
				    if(error){
				        return console.log(error);
				    }
				});

				// Go to trip details page
				res.render("tripdetails", {
							firstName : currentuser.firstname,
							lastName : currentuser.lastname,
							kmcostsum : rentalagreement.cost[0].toFixed(2),
							timecostsum : rentalagreement.cost[1].toFixed(2),
							kmcost : currentcar.kmcost,
							timecost : currentcar.timecost,
							sum : rentalagreement.sum.toFixed(2),
							kmdriven : rentalagreement.kmdriven.toFixed(2),
							timedriven : rentalagreement.timedriven.toFixed(2),
							starttime : starttime,
							endtime : endtime
				});
			}
			// If user is not at valid location,
			// give directions to location
			else {
				res.render('directiontolocation', {
						info : "Please drive to the closest designated location shown in the map to return the car (" +closestlocname+ ")",
						latfrom : userlat,
						longfrom : userlong,
						latto : closestlat,
						longto : closestlong,
						firstName : currentuser.firstname,
						lastName : currentuser.lastname
				})
			}
		})
	}
});

app.get("/findcar", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in to find a car.'
		});
	} else {
		res.render("findcar", {
			firstname : currentuser.firstname,
			lastname : currentuser.lastname
		});
	}
});

app.get("/paybill", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in.'
		});
	} else {
		res.render("paybill", {
			firstName : currentuser.firstname,
			lastName : currentuser.lastname
		});
	}
});

app.get("/emailsent", function(req, res) {
	res.render("showmessage", {
		message1 : "Confirmation email sent!",
		message2 : "Please check you email and follow the confirmation link to verify your account."
	});
});

app.get("/registernewuser", function(req, res) {
	res.render("registernewuser");
});

// Checks if the username exists and if the password matches the username if
// yes, a new customer is created.
app.post("/signin", function(req, res) {
	fs.readFile(__dirname + '/public/customerdata.json', 'utf8', function(err,
			data) {
		if (err)
			throw err;
		var customerdata = JSON.parse(data);
		var chck = -1;
		for (var i = 0; i < customerdata.length; ++i) {
			if (customerdata[i].email == req.body.username) {
				if (customerdata[i].status != "active") {
					res.render("showmessage", {
						message1 : "Your account has not been verified.",
						message2 : "Please verify your account with the verification link sent to you by email before logging in."
					})
				}
				chck = i;
				break;
			}
		}
		if (chck != -1 && customerdata[chck].password == req.body.password) {
			currentuser = new Customer(customerdata[chck].id,
					customerdata[chck].first_name,
					customerdata[chck].last_name, customerdata[chck].email,
					customerdata[chck].street_name, customerdata[chck].status,
					customerdata[chck].currentra);
			res.render("findCar", {
				firstname : customerdata[chck].first_name,
				lastname : customerdata[chck].last_name
			});
		} else {
			res.render("showmessage", {
				message1 : "Invalid username or password"
			})
		}
	})
});

// If a new user is registering, his/her data is stored in the userdata.json
// file
app.post("/registernewuser", function(req, res) {   
	// Create id
	function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	}
	var id =  s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
	
	fs.readFile(__dirname + '/public/customerdata.json', 'utf8', function(err,
			data) {
		if (err)
			throw err;
		var userdata = JSON.parse(data);
		
		userdata.push({
			id : id,
			first_name : req.body.firstName,
			last_name : req.body.lastName,
			email : req.body.email,
			street_name : req.body.street,
			city_add : req.body.city,
			postal_code : req.body.postalCode,
			province_name : req.body.province,
			password : req.body.password,
			status : "suspended",
			currentra : ""
		});
		var json = JSON.stringify(userdata);
		fs.writeFile(__dirname + '/public/customerdata.json', json);
	})
	
	var mailOptions = {
		from: '"MCarshare" <mcarshare4@gmail.com>', // sender address
		to: '', // list of receivers
		subject: 'Verification for your MCarShare account', // Subject line
		text: 'Hello ' + req.body.firstName + " " + req.body.lastName + ', <br> To verify your account, please follow this ', // plaintext body
		html: 'Hello ' + req.body.firstName + " " + req.body.lastName + ', <br> To verify your account, please follow this <a href = "' + link + '/verification/' + id + '"> Link</a>.' // html body
	};
	
	mailOptions.to = req.body.email;
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	});
	
	res.render("showmessage", {
		message1 : "Confirmation email sent!",
		message2 : "Please check you email and follow the confirmation link to verify your account."
	});
});

app.post("/directiontocar", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin");
	} else {
		// Check, if the user has currently rented a car
		if (currentuser.checkcurrentra() == true) {
			res.render("onlyonetrip", {
				firstname: currentuser.firstname,
				lastname : currentuser.lastname
			})
		}
		else {
			// Check previous bill		
			if (currentuser.checkpreviousbill() == true) {
				// Change car status to reserved
				currentcar.changestatus("reserved");
				
				// Get location of car to direct to car
				fs.readFile(__dirname + '/public/locationdata.json', 'utf8',					
						function(err, data) {
							if (err)
								throw err;
							var locationdata = JSON.parse(data);
							var chck = -1;
							var locationcar, latcar, longcar;
							for (var i = 0; i < locationdata.length; ++i) {
								if (locationdata[i].id == currentcar.location) {
									locationcar = new Location(
											locationdata[i].latitude,
											locationdata[i].longitude);
									latcar = locationdata[i].latitude;
									longcar = locationdata[i].longitude;
								}
							}

							res.render('directiontocar', {
								latfrom : currentuser.latitude,
								longfrom : currentuser.longitude,
								latto : latcar,
								longto : longcar,
								firstName : currentuser.firstname,
								lastName : currentuser.lastname
							});
						})
			} else {
				// Get last unpaid bill			
				bill = currentuser.unpaidbills[0];
				
				res.render("paybill", {
					firstName : currentuser.firstname,
					lastName : currentuser.lastname,
					amount : bill.sumtopay,
					date : bill.printdate(bill.date)
				});
			}
		}
	}
});

app.get ("/verification*", function (req, res){
	var url = req.url;
	var customerid = url.substr(14);
	
	// Set customer status with that id to 'active'
	fs.readFile(__dirname + '/public/customerdata.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		var customerdata = JSON.parse(data);
		for (var i = 0; i < customerdata.length; ++i) {
			if (customerdata[i].id == customerid) {
				customerdata[i].status = "active";
			}
		}
		// var fileObj = obj;
		var newobj = JSON.stringify(customerdata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/customerdata.json', newobj);
	})
	
	res.render("showmessage", {
		message1 : "Your account has been verified, you can now log in"
	});
});

app.get ("/billpaid*", function (req, res){
	var url = req.url;
	var billid = url.substr(10);
	
	// Set customer status with that id to 'active'
	fs.readFile(__dirname + '/public/billdata.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		var billdata = JSON.parse(data);
		for (var i = 0; i < billdata.length; ++i) {
			if (billdata[i].id == billid) {
				billdata[i].billpaid = true;
			}
		}
		// var fileObj = obj;
		var newobj = JSON.stringify(billdata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/billdata.json', newobj);
	})
	
	res.render("showmessage", {
		message1 : "Thank you for paying your bill."
	});
});

app.get ("/bill", function (req, res){
	res.render("billpayment");
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});