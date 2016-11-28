var fs = require('fs');
var Customer = require(__dirname + '/customer');
// var app = express();

function Datamanagement() {
	this.fs = require('fs');
}

module.exports = Datamanagement;

// Create a customer with the given username and password
Datamanagement.prototype.findcustomer = function(username, password) {
	console.log("Search for " + username + " password: " + password);
	var currentuser;
	fs.readFile('./public/customerdata.json', 'utf8', function(err, data) {
		if (err)
			throw err;
		var customerdata = JSON.parse(data);
		var chck = -1;
		for (var i = 0; i < customerdata.length; ++i) {
			if (customerdata[i].email == username) {
				console.log(customerdata[i].email);
				chck = i;
				break;
			}
		}
		if (chck != -1 && customerdata[chck].password == password) {
			console.log(password);
			currentuser = new Customer(customerdata[chck].first_name,
					customerdata[chck].last_name, customerdata[chck].email,
					customerdata[chck].street_name, 2);
			console.log(currentuser.firstname);
			return currentuser;
		} else {
			return currentuser;
		}
	})
}

//TEST
//dm = new Datamanagement();
//dm.changecarstatus("1", "reserved");
