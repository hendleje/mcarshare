// ------------ Person ------------
// Creates a person
function Person(firstName, lastName, email, address) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.email = email;
	this.address = address;
	/**
	 * TODO create proper ID automatically
	 */
	this.id = 1;
}

// ------------ Customer ------------
// Creates a customer
function Customer(firstName, lastName, email, address) {
	Person.call(this, firstName, lastName, email, address);
	this.status = cusStatus.SUSPENDED;
	this.sendConfirmationEmail();
	//module.exports = Customer;
}

// Define Enumeration for customer status
var cusStatus = {
	ACTIVE: "active",
	SUSPENDED: "suspended"
};

// Make sure, customer inherits from person
Customer.prototype = Object.create(Person.prototype);

// Check, if the previous bill of the customer was paid
Customer.prototype.checkPreviousBill = function(){
	/**
	 * TODO Implement check of previous bill
	 */
	return true;
}

// Send a email so the customer can confirm his/her mailaddress
Customer.prototype.sendConfirmationEmail = function() {
	/**
	 * TODO Implement sending of confirmation mail
	 */
	//console.log("Send mail to: " + this.email);
	return "Send mail to: " + this.email;
}

// Verifies the customer's mailadress and sets his/her status to active
Customer.prototype.customerVerified = function() {
	this.status = cusStatus.ACTIVE;
	console.log("Customer status: " + this.status);
	return "Customer status: " + this.status;
}

module.exports = Customer;