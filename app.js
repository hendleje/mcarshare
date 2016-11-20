
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , application = require('./routes/application')
  , Customer = require('./routes/customer');

var app = express();
var userid, firstname, lastname;

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

app.get("/index.hjs", function(req, res) {
	res.render("index");
});

app.get("/signin.hjs", function(req, res) {
	res.render("signin");
});

app.get("/registernewuser.hjs", function(req, res) {
	res.render("registernewuser");
});

app.get("/searchresults", function(req, res) {
	fs.readFile(__dirname + '/public/cardata.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		var cardata = JSON.parse(data);
		//for (var i = 0; i < carr_data.length; ++i) {
		res.render("searchresults", {carclass: cardata[0].carclass, model: cardata[0].model, distance: cardata[0].distance, price: cardata[0].price});
		//}
	})
	res.render("searchresults", {firstName: firstname, lastName: lastname});
});

app.get("/cardetails.hjs", function(req, res) {
	res.render("cardetails", {firstName: firstname, lastName: lastname});
});

app.get("/directiontocar.hjs", function(req, res) {
	res.render("directiontocar", {firstName: firstname, lastName: lastname});
});

app.get("/directiontolocation.hjs", function(req, res) {
	res.render("directiontolocation", {firstName: firstname, lastName: lastname});
});

app.get("/tripdetails.hjs", function(req, res) {
	res.render("directiontolocation", {firstName: firstname, lastName: lastname});
});

app.get("/findcar.hjs", function(req, res) {
	res.render("findcar", {firstName: firstname, lastName: lastname});
});

app.get("/emailsent.hjs", function(req, res) {
	res.render("emailsent");
});

app.get("/registernewuser.hjs", function(req, res) {
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
			var currentUser = new Customer(user_data[chck].first_name,user_data[chck].last_name,user_data[chck].email_id,user_data[chck].street_name);
			firstname = user_data[chck].first_name;
			lastname = user_data[chck].last_name;
			userid = user_data[chck].userid;
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


app.post("/cardetails", application.reservecar);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/test', application.reservecar);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
