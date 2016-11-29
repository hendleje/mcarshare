// ------------ Bill ------------
var fs = require('fs');

// Creates a bill
function Bill(sumtopay, customer, rentalagreement) {
	this.id = guid();
	this.sumtopay = sumtopay;
	this.rentalagreement = rentalagreement;
	this.customer = customer;
	this.billpaid = false;
}

// Change billpaid as the bill is paid
Bill.prototype.paybill = function() {
	this.billpaid = true;
}

// Sends the bill via email to the customer
Bill.prototype.sendbillviaemail = function(email) {
	// TODO Send bill
	return "Bill is sent";
}

// Saves bill in json file
Bill.prototype.savebill = function() {
	var id = this.id;
	var sumtopay = this.sumtopay;
	var rentalagreement = this.rentalagreement;
	var customer = this.customer;
	var billpaid = this.billpaid;
	
	fs.readFile('./public/billdata.json', 'utf8', function(err,
			data) {
		if (err)
			throw err;
		var billdata = JSON.parse(data);
		var id = billdata.length+1;
		billdata.push({
			id : id,
			sumtopay : sumtopay,
			rentalagreement : rentalagreement,
			customer : customer,
			billpaid : billpaid
		});
		var json = JSON.stringify(billdata);
		fs.writeFile('./public/billdata.json', json);
	})
}

function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
}

module.exports = Bill;