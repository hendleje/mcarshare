// ------------ Car ------------
// Creates a car
function Car(plate, brand, model, color, year, category, status, kmcost, timecost, creator, picture, location, description, carclass) {
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

//Calculate costs for km and hours driven
Car.prototype.getplate = function() {
	return this.plate;
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

// Calculate costs for km and hours driven
Car.prototype.getCosts = function(kmdriven, hoursdriven) {
	var kmcostcur = kmdriven * this.kmcost;
	var timecostcur = hoursdriven * this.timecost;
	var costs = [kmcostcur, timecostcur];
	return costs;
}


// Calculate air distance of car from given point via latitude and longitude
Car.prototype.calculateDistance = function(latitude, longitude) {
	var disLat = Math.pow(this.location.latitude - latitude, 2);
	var disLon = Math.pow(this.location.longitude - longitude, 2);
	var dis = Math.sqrt(disLat + disLon);
	return dis;
}

module.exports = Car;