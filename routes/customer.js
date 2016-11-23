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
}

// ------------ Customer ------------
// Creates a customer
function Customer(firstname, lastname, email, address, location) {
	Person.call(this, firstname, lastname, email, address);
	this.status = cusstatus.SUSPENDED;
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
	if (this.status == cusstatus.SUSPENDED) {
		return false;
	}
	else {
		/**
		 * TODO Implement check of previous bill
		 */
		return true;
	}
}

// Set the customer's status to active again, if all the bills are payed
Customer.prototype.billpayed = function(bill) {
	/**
	 * TODO Check, if any other bills are not payed, if not, set the status to active again
	 */
}

// Add a new bill to the current list of bills
Customer.prototype.addbill = function(bill) {
	this.bills.add(bill);
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