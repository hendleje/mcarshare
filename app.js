/**
 * Module dependencies.
 */

var express = require('express')
 // , routes = require('./routes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , application = require('./routes/application')
  , Customer = require('./routes/customer')
  , Car = require('./routes/car')
  , Location = require('./routes/location');

var app = express();
var /*userid, firstname, lastname,*/ currentcar, currentuser;

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
	res.render("signin", {info: 'You are successfully logged out.'});
});

app.get("/registernewuser", function(req, res) {
	res.render("registernewuser");
});

app.get("/searchresults", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {info: 'Please sign in to view search results.'});
	} else {
		fs.readFile(__dirname + '/public/cardata.json', 'utf8', function(err,
				data) {
			if (err)
				throw err;
			var cardata = JSON.parse(data);
			// for (var i = 0; i < carr_data.length; ++i) {
			currentcar = cardata[0].plate;
			res.render("searchresults", {
				firstName : currentuser.firstname,
				lastName : currentuser.lastname,
				picture : cardata[0].picture,
				carclass : cardata[0].carclass,
				model : cardata[0].model,
				distance : cardata[0].distance,
				kmprice : cardata[0].kmCost,
				hrprice : cardata[0].timeCost
			});
			//}
		})
	}
});

app.get("/cardetails", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {info: 'Please sign in to view car details.'});	
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
			//				}
			//			}
		})
	}
});

app.get("/directiontocar", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {info: 'Please sign in to view directions to car.'});
	}
	else {
		res.render("directiontocar", {firstName: currentuser.firstname, lastName: currentuser.lastname});
	}
});

app.get("/directiontolocation", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {info: 'Please sign in to view directions to location.'});
	}
	else {
		res.render("directiontolocation", {firstName: currentuser.firstname, lastName: currentuser.lastname});
	}
});

app.get("/tripdetails", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {info: 'Please sign in to view trip details.'});
	}
	else {
		res.render("directiontolocation", {firstName: currentuser.firstname, lastName: currentuser.lastname});
	}
});

app.get("/findcar", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin", {info: 'Please sign in to find a car.'});
	}
	else {
		res.render("findcar", {firstName: currentuser.firstname, lastName: currentuser.lastname});
	}
});

app.get("/emailsent", function(req, res) {
	res.render("emailsent");
});

app.get("/registernewuser", function(req, res) {
	res.render("registernewuser");
});


//Checks if the username exists and if the password matches the username if
//yes, a new customer is created.
app.post("/signin", function(req, res) {
	fs.readFile(__dirname + '/public/userdata.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		var user_data = JSON.parse(data);
		var chck = -1;
		for (var i = 0; i < user_data.length; ++i) {
			if (user_data[i].email_id == req.body.username) {
				chck = i;
				break;
			}
		}
		if (chck != -1 && user_data[chck].password == req.body.password) {
			currentuser = new Customer(user_data[chck].first_name,user_data[chck].last_name,user_data[chck].email_id,user_data[chck].street_name, 2);
			res.render("findCar", {firstName: user_data[chck].first_name, lastName: user_data[chck].last_name});
		} else {
			res.send("Invalid Username or Password.");
		}
	})
});

//If a new user is registering, his/her data is stored in the userdata.json
//file
app.post("/registernewuser", function(req, res) {
	fs.readFile(__dirname + '/public/userdata.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		var user_data = JSON.parse(data);
		user_data.push({
			first_name : req.body.firstName,
			last_name : req.body.lastName,
			email_id : req.body.email,
			street_name : req.body.street,
			city_add : req.body.city,
			postal_code : req.body.postalCode,
			province_name : req.body.province,
			password : req.body.password
		});
		var json = JSON.stringify(user_data);
		fs.writeFile(__dirname + '/public/userdata.json', json);
	})
	res.render("emailsent");
});


app.post("/directiontocar", function(req, res) {
	if (typeof currentuser == 'undefined') {
		res.render("signin");
	} else {
		if (currentuser.checkpreviousbill() == true) {
			// Get location of user and car to direct to car
			fs.readFile(__dirname + '/public/location.json', 'utf8',
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
							bill : 'approved',
							latcar : latcar,
							longcar : longcar,
							latuser : latuser,
							longuser : longuser
						});
					})
		} else {
			res.render('paybill', {
				bill : 'not approved'
			});
		}
	}
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
