/**
 * Module dependencies.
 */

var express = require('express'), http = require('http'), path = require('path'), fs = require('fs'), application = require('./routes/application'), Customer = require('./routes/customer'), Car = require('./routes/car'), Location = require('./routes/location'), Rentalagreement = require('./routes/rentalagreement'), Bill = require('./routes/bill');

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
			currentcar = new Car(cardata[i].plate, cardata[i].brand,
					cardata[i].model, cardata[i].color, cardata[i].year,
					cardata[i].category, cardata[i].status, cardata[i].kmcost,
					cardata[i].timecost, cardata[i].creator,
					cardata[i].picture, cardata[i].location,
					cardata[i].description, cardata[i].carclass);
			console.log(currentcar.plate);
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
					// TODO set car status to "rented"
					rentalagreement = new Rentalagreement(currentuser.id,
							currentcar.id);
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

app
		.post(
				"/tripdetails",
				function(req, res) {
					if (typeof currentuser == 'undefined') {
						res.render("signin", {
							info : 'Please sign in to view trip details.'
						});
					} else {
						// Check, if user at one of the designated locations
						// TODO get correct userlocation
						var userlat, userlong;
						if (count == 0) {
							userlat = -50, 34;
							userlong = 30.33;
							count++;
						} else {
							userlat = -47.54;
							userlong = 52.73;
						}
						var atlocation;
						var mindist = 100000;
						var closestlong = 0;
						var closestlat = 0;
						fs
								.readFile(
										__dirname + '/public/locationdata.json',
										'utf8',
										function(err, data) {
											if (err)
												throw err;
											var locationdata = JSON.parse(data);
											// Calculate distances from
											// designated locations
											for (var i = 0; i < locationdata.length; ++i) {
												current = new Location(
														locationdata[i].latitude,
														locationdata[i].longitude);
												var distance = current
														.calculatedistance(
																userlat,
																userlong);
												if (distance < 10) {
													atlocation = true;
													console.log(atlocation);
													// break;
												} else {
													atlocation = false;
												}
												if (distance < mindist) {
													closestlong = current.longitude;
													closeslat = current.latitude;
												}
											}

											// If user is at valid location,
											// return car
											if (atlocation) {
												if (typeof rentalagreement.endtime == 'undefined') {
													// TODO change car status
													rentalagreement
															.carreturned(
																	10,
																	currentcar.kmcost,
																	currentcar.timecost);
												}

												// Create bill and send it to
												// the user
												bill = new Bill(
														rentalagreement.sum,
														currentuser.id,
														rentalagreement.id);
												bill
														.sendbillviaemail(currentuser.email);
												currentuser.addbill(bill);
												// TODO save bill in file

												// Get nice representation of
												// the start and end time
												var starttime = rentalagreement
														.printdate(rentalagreement.starttime);
												var endtime = rentalagreement
														.printdate(rentalagreement.endtime);
 
												//mail_Options.to = req.body.email;
												//transporter.sendMail(mail_Options, function(error, info){
												    //if(error){
												        //return console.log(error);
												    //}
												   // console.log('Message sent: ' + info.response);
												//});
												// Go to trip details page
												res
														.render(
																"tripdetails",
																{
																	firstName : currentuser.firstname,
																	lastName : currentuser.lastname,
																	kmcostsum : rentalagreement.cost[0]
																			.toFixed(2),
																	timecostsum : rentalagreement.cost[1]
																			.toFixed(2),
																	kmcost : currentcar.kmcost,
																	timecost : currentcar.timecost,
																	sum : rentalagreement.sum
																			.toFixed(2),
																	kmdriven : rentalagreement.kmdriven
																			.toFixed(2),
																	timedriven : rentalagreement.timedriven
																			.toFixed(2),
																	starttime : starttime,
																	endtime : endtime
																});
											}
											// If user is not at valid location,
											// give directions to location
											else {
												console
														.log("Too far : atlocation = "
																+ atlocation);
												res
														.render(
																'directiontolocation',
																{
																	info : "Please drive to the closest designated location shown in the map to return the car",
																	latfrom : userlat,
																	longfrom : userlong,
																	latto : closestlat,
																	longto : closestlong,
																	firstName : currentuser.firstname,
																	lastName : currentuser.lastname
																})
											}
										})
						console.log("Location: " + atlocation);
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
			currentuser = new Customer(customerdata[chck].first_name,
					customerdata[chck].last_name, customerdata[chck].email,
					customerdata[chck].street_name, 2);
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
		var user_data = JSON.parse(data);
		user_data.push({
			first_name : req.body.firstName,
			last_name : req.body.lastName,
			email : req.body.email,
			street_name : req.body.street,
			city_add : req.body.city,
			postal_code : req.body.postalCode,
			province_name : req.body.province,
			password : req.body.password
		});
		var json = JSON.stringify(user_data);
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
		if (currentuser.checkpreviousbill() == true) {
			// Get location of user and car to direct to car
			fs.readFile(__dirname + '/public/locationdata.json', 'utf8',
					// TODO: Set car status reserved
					function(err, data) {
						if (err)
							throw err;
						var locationdata = JSON.parse(data);
						var chck = -1;
						var locationcar, locationuser;
						for (var i = 0; i < locationdata.length; ++i) {
							if (locationdata[i].id == currentcar.location) {
								locationcar = new Location(
										locationdata[i].latitude,
										locationdata[i].longitude);
							}
							if (locationdata[i].id == currentuser.location) {
								locationuser = new Location(
										locationdata[i].latitude,
										locationdata[i].longitude);
							}
						}
						console.log(locationcar.latitude + " "
								+ locationcar.longitude);
						console.log(locationuser.latitude + " "
								+ locationuser.longitude);
						var latcar = locationcar.latitude;
						var longcar = locationcar.longitude;
						var latuser = locationuser.latitude;
						var longuser = locationuser.longitude;
						res.render('directiontocar', {
							latfrom : latuser,
							longfrom : longuser,
							latto : latcar,
							longto : longcar,
							firstName : currentuser.firstname,
							lastName : currentuser.lastname
						});
					})
		} else {
			// TODO set customer status to 'suspended'
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
