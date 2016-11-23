// ------------ Rental Agreement ------------
// Creates a rental agreement
function Rentalagreement(customer, car) {
	this.starttime = this.getcurrenttime();
	this.car = car;
	this.customer = customer;
}

// When returning the car all remaining information is calculated
Rentalagreement.prototype.carreturned = function(kmdriven, kmcost, timecost) {
	console.log("Car returned");
	// Save km driven
	this.kmdriven = kmdriven;
	
	// Save endtime
	this.endtime = this.getcurrenttime();
	
	// Calculate and save time driven
	this.timedriven = Math.round((this.endtime - this.starttime)/1000/60/60*100) /100;
	
	// Calculate costs
	this.cost = this.calculatecosts(kmcost, timecost);
	this.sum = this.cost[0] + this.cost[1];
}

//Calculate costs for km and hours driven
Rentalagreement.prototype.calculatecosts = function(kmcost, timecost) {
	var kmcostcur = this.kmdriven * kmcost;
	var timecostcur = this.timedriven * timecost;
	var costs = [kmcostcur, timecostcur];
	return costs;
}

//Gets the current time
Rentalagreement.prototype.getcurrenttime = function() {
	var currentdate = new Date(); 
//	var datetime = "Last Sync: " + currentdate.getDate() + "/"
//	                + (currentdate.getMonth()+1)  + "/" 
//	                + currentdate.getFullYear() + " @ "  
//	                + currentdate.getHours() + ":"  
//	                + currentdate.getMinutes() + ":" 
//	                + currentdate.getSeconds();
//	console.log(datetime);
	return currentdate;
}

// Print date
Rentalagreement.prototype.printdate = function(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var year = date.getFullYear();
	var hours = date.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var min = date.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	var sec = date.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}
	var nicedate = "" + hours + ":" + min + ":" + sec + " (" + day + "/" + month + "/" + year + ")";
	return nicedate;
}

module.exports = Rentalagreement;

// Test
//ra = new Rentalagreement(1, 2);
//console.log(ra.starttime);
//ra.carreturned(10);
//var nice = ra.printdate(ra.starttime);
//console.log(nice);