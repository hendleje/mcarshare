// ------------ Rental Agreement ------------
var fs = require('fs');

// Creates a rental agreement
function Rentalagreement(customer, car) {
	this.id = guid();
	this.starttime = this.getcurrenttime();
	this.car = car;
	this.customer = customer;
}

function Rentalagreement(car, customer, id, starttime) {
	if (typeof id == 'undefined' || id == "undefined") {
		this.id = guid();
	}
	else {
		this.id = id;
	}
	if (typeof starttime == 'undefined' || starttime == "undefined") {
		this.starttime = this.getcurrenttime();
	}
	else {
		this.starttime = new Date (starttime);
	}
	this.car = car;
	this.customer = customer;
}

//Save the rentalagreement in the json file
Rentalagreement.prototype.save = function() {
	var start = this.starttime;
	var end = this.endtime;
	var kmdriven = this.kmdriven;
	var cost = this.cost;
	var car = this.car;
	var customer = this.customer;
	var id = this.id;
	fs.readFile('./public/rentalagreementdata.json', 'utf8', function(err,
			data) {
		if (err)
			throw err;
		var radata = JSON.parse(data);
		//id = radata.length+1;
		radata.push({
			id : id,
			starttime : start,
			endtime : end,
			kmdriven : kmdriven,
			cost : cost,
			car : car,
			customer : customer
		});
		var json = JSON.stringify(radata);
		fs.writeFile('./public/rentalagreementdata.json', json);
	})
}

//When returning the car all remaining information is calculated
Rentalagreement.prototype.carreturned = function(kmdriven, kmcost, timecost) {
	// Save km driven
	this.kmdriven = kmdriven;
	
	// Save endtime
	this.endtime = this.getcurrenttime();
	
	// Calculate and save time driven
	this.timedriven = Math.round((this.endtime - this.starttime)/1000/60/60*100) /100;
	
	// Calculate costs
	this.cost = this.calculatecosts(kmcost, timecost);
	this.sum = this.cost[0] + this.cost[1];
	
	// Save changes in json file
	var id = this.id;
	var endtime = this.endtime;
	var cost = this.cost;
	var sum = this.sum;
	console.log(id);
	fs.readFile('./public/rentalagreementdata.json', 'utf-8', function(err, obj) {
		// Using another variable to prevent confusion.
		var radata = JSON.parse(obj);
				
		// Modify the status at the appropriate id
		for (var i = 0; i < radata.length; ++i) {
			if (radata[i].id == id) {
				console.log("found");
				console.log(endtime);
				radata[i].endtime = endtime;
				radata[i].cost = cost;
				radata[i].sum = sum;
			}
		}

		// var fileObj = obj;
		var newobj = JSON.stringify(radata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/rentalagreementdata.json', newobj);
	});
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

//Print starttime
Rentalagreement.prototype.printstart = function() {	
	var day = this.starttime.getDate();
	var month = this.starttime.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var year = this.starttime.getFullYear();
	var hours = this.starttime.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var min = this.starttime.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	var sec = this.starttime.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}
	var nicedate = "" + hours + ":" + min + ":" + sec + " (" + day + "/" + month + "/" + year + ")";
	return nicedate;
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

module.exports = Rentalagreement;

// Test
//ra = new Rentalagreement(1, 2);
//console.log(ra.starttime);
//ra.carreturned(10);
//var nice = ra.printdate(ra.starttime);
//console.log(nice);