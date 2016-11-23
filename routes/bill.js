// ------------ Bill ------------
// Creates a bill
function Bill(sumtopay, customer, rentalagreement) {
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
Bill.prototype.sendbillviaemail = function() {
	// TODO Send bill
	return "Bill is sent";
}

module.exports = Bill;