// ------------ Rental Agreement ------------
// Creates a rental agreement
function Rentalagreement(plate, brand, model, color, year, category, status, kmcost, timecost, creator, picture, location, description, carclass) {
	this.starttime = this.getcurrenttime();
	this.model = model;
	this.car = car;
	this.customer = customer;
}

// When returning the car all remaining information is calculated
Rentalagreement.prototype.carreturned = function(kmdriven) {
	this.kmdriven = kmdriven;
	this.endtime = this.getcurrenttime();
	// TODO calculate hours driven properly;
	this.timedriven = endtime - starttime;
	this.costs = this.calculatecosts(kmdriven, timedriven);
}

//Calculate costs for km and hours driven
Rentalagreement.prototype.calculatecosts = function(kmdriven, hoursdriven) {
	var kmcostcur = kmdriven * this.kmcost;
	var timecostcur = hoursdriven * this.timecost;
	var costs = [kmcostcur, timecostcur];
	return costs;
}

//Gets the current time
Rentalagreement.prototype.getcurrenttime = function() {
	// TODO Implement how to get current time
	return currenttime;
}

module.exports = Rentalagreement;