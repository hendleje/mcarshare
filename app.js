
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/signin.hjs", function(req, res) {
	res.render("signin");
});

app.get("/registernewuser.hjs", function(req, res) {
	res.render("registernewuser");
});

app.get("/searchresults.hjs", function(req, res) {
	res.render("searchresults");
});

app.get("/cardetails.hjs", function(req, res) {
	res.render("cardetails");
});

app.get("/directiontocar.hjs", function(req, res) {
	res.render("directiontocar");
});

app.get("/directiontolocation.hjs", function(req, res) {
	res.render("directiontolocation");
});

app.get("/tripdetails.hjs", function(req, res) {
	res.render("tripdetails");
});

app.get("/findcar.hjs", function(req, res) {
	res.render("findcar");
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
			// var currentUser = new
			// Customer(user_data[chck].first_name,user_data[chck].last_name,user_data[chck].email_id,user_data[chck].street_name,user_data[chck].city_add,user_data[chck].postal_code,user_data[chck].province_name);
			// var currentUser = new
			// Customer(user_data[chck].first_name,user_data[chck].last_name,user_data[chck].email_id,user_data[chck].street_name);
			//res.sendfile('./presentationLayer/findCar.html');
			res.render("findCar");
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
	//res.sendfile('./' + "presentationLayer/emailSent.html");
	res.render("emailsent");
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
