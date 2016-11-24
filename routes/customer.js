// ------------ Person ------------
// Creates a person
function Person(firstname, lastname, email, address) {
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.address = address;
	/**
	 * TODO create proper ID automatically
	 */
	this.id = 1;
	this.unpaidbills = new Array();
	this.paidbills = new Array();
}

// ------------ Customer ------------
// Creates a customer
function Customer(firstname, lastname, email, address, location) {
	Person.call(this, firstname, lastname, email, address);
	// TODO: Once confirmation mail is sent, set status initially to suspended
	this.status = cusstatus.ACTIVE;
	this.sendconfirmationemail();
	this.location = location;
}

module.exports = Customer;

// Define Enumeration for customer status
var cusstatus = {
	ACTIVE: "active",
	SUSPENDED: "suspended"
};

// Make sure, customer inherits from person
Customer.prototype = Object.create(Person.prototype);

// Check, if the previous bill of the customer was paid
Customer.prototype.checkpreviousbill = function(){
	if (this.status == cusstatus.SUSPENDED || this.unpaidbills.length > 0) {
		console.log("Unpaidbills length: " + this.unpaidbills.length);
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

//Tests
//var customer1 = new Customer("Jenny", "Hendler", "bla", "bla");
//console.log(customer1.status);
//console.log(customer1.checkpreviousbill());
//customer1.addbill(1);
//customer1.addbill(2);
//customer1.addbill(3);
//console.log("All " + customer1.unpaidbills.length + " bills added:");
//for (var i=0; i<customer1.unpaidbills.length; i++) {
//	console.log(customer1.unpaidbills[i]);
//}
//console.log(customer1.checkpreviousbill());
//customer1.billpaid(2);
//customer1.billpaid(1);
//customer1.billpaid(3);
//console.log("Bill 2 paid:");
//for (var i=0; i<customer1.unpaidbills.length; i++) {
//	console.log("unpaid: " + customer1.unpaidbills[i]);
//}
//for (var i=0; i<customer1.paidbills.length; i++) {
//	console.log("paid: " + customer1.paidbills[i]);
//}
//console.log(customer1.status);
//console.log(customer1.checkpreviousbill());