// ------------ Car ------------
var fs = require('fs');

// Creates a car
function Car(id, plate, brand, model, color, year, category, status, kmcost, timecost, creator, picture, location, description, carclass) {
	this.id = id;
	this.plate = plate;
	this.brand = brand;
	this.model = model;
	this.color= color;
	this.year = year;
	this.carclass = carclass;
	this.status = status;
	this.kmcost = kmcost;
	this.timecost = timecost;
	this.creator = creator;
	this.picture = picture;
	this.location = location;
	this.description = description;
	this.status = carstatus.available;
}

// Define Enumeration for car status
var carstatus = {
	AVAILABLE: "available",
	RESERVED: "reserved",
	RENTED: "rented",
	INREPAIR: "inRepair"
}

// Define Enumeration for car brand
var carbrand = {
	AUDI: "Audi",
	BMW: "BMW",
	CHRYSLER: "Chrysler",
	DODGE: "Dodge",
	FIAT: "Fiat",
	HYUNDAI: "Hyundai",
	INFINITY: "Infinity",
	JEEP: "Jeep",
	SAAB: "Saab",
	TOYOTA: "Toyota",
	VOLKSWAGEN: "Volkswagen",
	VOLVO: "Volvo"
}

// Define Enumeration for car category
var carCategory = {
	SMALL: "small",
	INTERMEDIATE: "intermediate",
	FULLSIZE: "fullsize",
	SUV: "suv",
	VAN: "van",
	LUXURY: "luxury"
}

// Set status for the car and save change in json file
Car.prototype.changestatus = function(newstatus) {
	this.status = newstatus;
	var id = this.id;
	
	// Save new status in json file
	fs.readFile('./public/cardata.json', 'utf-8', function(err, obj) {
		// Using another variable to prevent confusion.
		var cardata = JSON.parse(obj);
				
		// Modify the status at the appropriate id
		for (var i = 0; i < cardata.length; ++i) {
			if (cardata[i].id == id) {
				cardata[i].status = newstatus;
			}
		}

		// var fileObj = obj;
		var newobj = JSON.stringify(cardata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/cardata.json', newobj);
	});
}

// Change status and location for the car and save change in json file
Car.prototype.changestatusandlocation = function(newstatus, newlocation) {
	this.location = newlocation;
	this.status = newstatus
	var id = this.id;
	
	// Save new status in json file
	fs.readFile('./public/cardata.json', 'utf-8', function(err, obj) {
		// Using another variable to prevent confusion.
		var cardata = JSON.parse(obj);
				
		// Modify the status at the appropriate id
		for (var i = 0; i < cardata.length; ++i) {
			if (cardata[i].id == id) {
				cardata[i].location = newlocation;
				cardata[i].status = newstatus;
			}
		}

		// var fileObj = obj;
		var newobj = JSON.stringify(cardata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/cardata.json', newobj);
	});
}

//Change location for the car and save change in json file
Car.prototype.changelocation = function(newlocation) {
	this.location = newlocation;
	var id = this.id;
	
	// Save new status in json file
	fs.readFile('./public/cardata.json', 'utf-8', function(err, obj) {
		// Using another variable to prevent confusion.
		var cardata = JSON.parse(obj);
				
		// Modify the status at the appropriate id
		for (var i = 0; i < cardata.length; ++i) {
			if (cardata[i].id == id) {
				cardata[i].location = newlocation;
			}
		}

		// var fileObj = obj;
		var newobj = JSON.stringify(cardata);

		// Write the modified obj to the file
		fs.writeFileSync('./public/cardata.json', newobj);
	});
}


//Calculate air distance of car from given point via latitude and longitude
//Car.prototype.calculatedistance = function(latitude, longitude) {
//	var disLat = Math.pow(this.location.latitude - latitude, 2);
//	var disLon = Math.pow(this.location.longitude - longitude, 2);
//	var dis = Math.sqrt(disLat + disLon);
//	return dis;
//}

module.exports = Car;