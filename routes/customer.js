// ------------ Person ------------
var fs = require('fs');
var Bill = require(__dirname + '/bill');

// Creates a person
function Person(id, firstname, lastname, email, address) {
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.address = address;
	this.id = id;
	this.unpaidbills = new Array();
	this.paidbills = new Array();
}

// ------------ Customer ------------
// Creates a customer
function Customer(id, firstname, lastname, email, address, status, currentra) {
	Person.call(this, id, firstname, lastname, email, address);
	this.status = status;
	this.sendconfirmationemail();
	this.currentra = currentra;
}

module.exports = Customer;

// Define Enumeration for customer status
var cusstatus = {
	ACTIVE: "active",
	SUSPENDED: "suspended"
};

// Make sure, customer inherits from person
Customer.prototype = Object.create(Person.prototype);

// Check, if the customer has a current rental agreement
Customer.prototype.checkcurrentra = function() {
	var cusid = this.id;
	var hascurrentra = false;
	
	var data = fs.readFileSync('./public/rentalagreementdata.json', 'utf8');
	var radata = JSON.parse(data);
	for (var i = 0; i < radata.length; i++) {
		if (radata[i].customer == cusid && typeof radata[i].endtime == 'undefined') {
			hascurrentra = true;
		}
	}
	return hascurrentra;
}

// Check, if the previous bill of the customer was paid
Customer.prototype.checkpreviousbill = function(){
	var cusid = this.id;
	
	var data = fs.readFileSync('./public/billdata.json', 'utf8');
	var billdata = JSON.parse(data);
	for (var i = 0; i < billdata.length; i++) {
		if (billdata[i].customer == cusid) {
			var bill = new Bill(billdata[i].sumtopay, billdata[i].customer, billdata[i].rentalagreement);
			if (billdata[i].billpaid) {
				this.paidbills.push(bill);
			}
			else {
				this.unpaidbills.push(bill);
			}
		}
	}

	if (this.status == cusstatus.SUSPENDED || this.unpaidbills.length > 0) {
		return false;
	}
	else {
		return true;
	}
}

// Set the customer's status to active again, if all the bills are paid
Customer.prototype.billpaid = function(bill) {	
	// Remove bill from unpaid bills list
	var index = this.unpaidbills.indexOf(bill);
	if (index > -1) {
	    this.unpaidbills.splice(index, 1);
	}
	
	// Add bill to paid bills list
	this.paidbills.push(bill);
	
	// If all bills are paid, set status to active again
	if (this.unpaidbills.length == 0) {
		this.status = cusstatus.ACTIVE;
	}
}

// Add a new bill to the current list of bills
Customer.prototype.addbill = function(bill) {
	this.unpaidbills.push(bill);
}

// Send a email so the customer can confirm his/her mailaddress
Customer.prototype.sendconfirmationemail = function() {
	/**
	 * TODO Implement sending of confirmation mail
	 */
	return "Send mail to: " + this.email;
}

// Verifies the customer's mailadress and sets his/her status to active
Customer.prototype.customerverified = function() {
	this.status = cusstatus.ACTIVE;
	console.log("Customer status: " + this.status);
	return "Customer status: " + this.status;
}

// Change customer status
Customer.prototype.changestatus = function(newstatus){
	this.status = newstatus;
	var id = this.id;
	
	// Save new status in json file
	fs.readFile('./public/customerdata.json', 'utf-8', function(err, obj) {
		// Using another variable to prevent confusion.
		var customerdata = JSON.parse(obj);
				
		// Modify the status at the appropriate id
		for (var i = 0; i < customerdata.length; ++i) {
			if (customerdata[i].id == id) {
				customerdata[i].status = newstatus;
			}
		}

		// var fileObj = obj;
		var newobj = JSON.stringify(customerdata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/customerdata.json', newobj);
	});
}

//Change current rental agreement of customer
Customer.prototype.changera = function(newra){
	var id = this.id;
	
	// Save new status in json file
	fs.readFile('./public/customerdata.json', 'utf-8', function(err, obj) {
		// Using another variable to prevent confusion.
		var customerdata = JSON.parse(obj);
				
		// Modify the status at the appropriate id
		for (var i = 0; i < customerdata.length; ++i) {
			if (customerdata[i].id == id) {
				customerdata[i].currentra = newra;
			}
		}

		// var fileObj = obj;
		var newobj = JSON.stringify(customerdata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/customerdata.json', newobj);
	});
}

// Tests
// var customer1 = new Customer("Jenny", "Hendler", "bla", "bla");
// console.log(customer1.status);
// console.log(customer1.checkpreviousbill());
// customer1.addbill(1);
// customer1.addbill(2);
// customer1.addbill(3);
// console.log("All " + customer1.unpaidbills.length + " bills added:");
// for (var i=0; i<customer1.unpaidbills.length; i++) {
// console.log(customer1.unpaidbills[i]);
// }
// console.log(customer1.checkpreviousbill());
// customer1.billpaid(2);
// customer1.billpaid(1);
// customer1.billpaid(3);
// console.log("Bill 2 paid:");
// for (var i=0; i<customer1.unpaidbills.length; i++) {
// console.log("unpaid: " + customer1.unpaidbills[i]);
// }
// for (var i=0; i<customer1.paidbills.length; i++) {
// console.log("paid: " + customer1.paidbills[i]);
// }
// console.log(customer1.status);
// console.log(customer1.checkpreviousbill());
