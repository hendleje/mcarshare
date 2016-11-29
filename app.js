/**
 * Module dependencies.
 */

var express = require('express'), http = require('http'), path = require('path'), fs = require('fs'), application = require('./routes/application'), Customer = require('./routes/customer'), Car = require('./routes/car'), Location = require('./routes/location'), Rentalagreement = require('./routes/rentalagreement'), Bill = require('./routes/bill'), Datamanagement = require('./routes/datamanagement');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://mcarshare4%40gmail.com:stutter1@smtp.gmail.com');

var mailOptions = {
    from: '"MCarshare" <mcarshare4@gmail.com>', // sender address
    to: '', // list of receivers
    subject: 'Hello', // Subject line
    text: 'To verify your account, please follow the ', // plaintext body
    html: '<b>To verify your account, please follow the </b> <a href = "http://localhost:3343/verification"> link</a>' // html body
};
//var mail_Options = {
	    //from: '"MCarshare" <mcarshare4@gmail.com>', // sender address
	    //to: 'ezekwesilisandraonyinye@gmail.com', // list of receivers
	    //subject: 'Current Bill', // Subject line
	    //text: 'Your current bill is as follows: ', // plaintext body
	    //html: '<b> Your current bill is as follows:</b>' // html body
	//};

var app = express();
var currentcar, currentuser, rentalagreement;
var count = 0;

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
	if (currentcar.status = "reserved") {
		currentcar.changestatus("available");
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

app.get("/searchresults", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {
			info : 'Please sign in to view search results.'
		});
	} else {
		fs.readFile(__dirname + '/public/cardata.json', 'utf8', function(err,
				data) {
			if (err)
				throw err;
			var cardata = JSON.parse(data);
			// for (var i = 0; i < carr_data.length; ++i) {
			if (cardata[0].status == 'available') {
				res.render("searchresults", {
					firstName : currentuser.firstname,
					lastName : currentuser.lastname,
					picture : cardata[0].picture,
					carclass : cardata[0].carclass,
					model : cardata[0].model,
					distance : cardata[0].distance,
					kmprice : cardata[0].kmcost,
					hrprice : cardata[0].timecost
				});
			}
			else {
				res.render("searchresults");
			}
			// }
		})
	}
});

app.get("/cardetails", function(req, res) {
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
			var i = 0;
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

app.get("/tripinformation",
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
				// Change car status to available
				currentcar.changestatus("available");
				currentcar.changelocation(closestloc);

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
				
				//mail_Options.to = req.body.email;
				//transporter.sendMail(mail_Options, function(error, info){
				    //if(error){
				        //return console.log(error);
				    //}
				   // console.log('Message sent: ' + info.response);
				//});

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
			firstName : currentuser.firstname,
			lastName : currentuser.lastname
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
	res.render("emailsent");
});

app.get("/registernewuser", function(req, res) {
	res.render("registernewuser");
});

// Checks if the username exists and if the password matches the username if
// yes, a new customer is created.
app.post("/signin", function(req, res) {
//	dm = new Datamanagement();
//	if (typeof dm.findcustomer(req.body.username, req.body.password) == 'undefined') {
//		res.send("Invalid Username or Password.");
//	}
//	else {
//		currentuser = getuser;
//		res.render("findCar", {
//			firstName : currentuser.firstname,
//			lastName : currentuser.last_name
//		});
//	}
	fs.readFile(__dirname + '/public/customerdata.json', 'utf8', function(err,
			data) {
		if (err)
			throw err;
		var customerdata = JSON.parse(data);
		var chck = -1;
		for (var i = 0; i < customerdata.length; ++i) {
			if (customerdata[i].email == req.body.username) {
				chck = i;
				break;
			}
		}
		if (chck != -1 && customerdata[chck].password == req.body.password) {
			currentuser = new Customer(customerdata[chck].id,
					customerdata[chck].first_name,
					customerdata[chck].last_name, customerdata[chck].email,
					customerdata[chck].street_name, customerdata[chck].status,
					customerdata[chck].latitude, customerdata[chck].longitude,
					customerdata[chck].currentra);
			res.render("findCar", {
				firstName : customerdata[chck].first_name,
				lastName : customerdata[chck].last_name
			});
		} else {
			res.send("Invalid Username or Password.");
		}
	})
});

// If a new user is registering, his/her data is stored in the userdata.json
// file
app.post("/registernewuser", function(req, res) {
	fs.readFile(__dirname + '/public/customerdata.json', 'utf8', function(err,
			data) {
		if (err)
			throw err;
		var userdata = JSON.parse(data);
		var id = userdata.length+1;
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
			latitude : 1,
			longitude : 1,
			currentra : ""
		});
		var json = JSON.stringify(userdata);
		fs.writeFile(__dirname + '/public/customerdata.json', json);
	})
	
	// send mail with defined transport object
	mailOptions.to = req.body.email;
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
	
	res.render("emailsent");
});

app.post("/directiontocar", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin");
	} else {
		
		// Check previous bill		
		if (currentuser.checkpreviousbill() == true) {
			// Change car status to reserved
			currentcar.changestatus("reserved");
			
			// Get location of user and car to direct to car
			fs.readFile(__dirname + '/public/locationdata.json', 'utf8',					
					function(err, data) {
						if (err)
							throw err;
						var locationdata = JSON.parse(data);
						var chck = -1;
						var locationcar
//						, locationuser;
						for (var i = 0; i < locationdata.length; ++i) {
							if (locationdata[i].id == currentcar.location) {
								locationcar = new Location(
										locationdata[i].latitude,
										locationdata[i].longitude);
							}
//							if (locationdata[i].id == currentuser.location) {
//								locationuser = new Location(
//										locationdata[i].latitude,
//										locationdata[i].longitude);
//							}
						}
//						console.log(locationcar.latitude + " "
//								+ locationcar.longitude);
//						console.log(locationuser.latitude + " "
//								+ locationuser.longitude);
						var latcar = locationcar.latitude;
						var longcar = locationcar.longitude;
//						var latuser = locationuser.latitude;
//						var longuser = locationuser.longitude;
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
			// Set customer status to 'suspended'
			currentuser.changestatus("suspended");
			
			// TODO get unpaid bill(s) information and display it
			
			
			res.render("paybill", {
				firstName : currentuser.firstname,
				lastName : currentuser.lastname
			});
		}
	}
});

app.get ("/verification", function (req, res){
	res.render("emailverification");
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});