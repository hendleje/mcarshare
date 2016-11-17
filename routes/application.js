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
	//this.status = cusStatus.SUSPENDED;
	//this.sendConfirmationEmail();
	module.exports = Customer;
}

// Define Enumeration for customer status
var cusStatus = {
	ACTIVE: "active",
	SUSPENDED: "suspended"
}

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

// ------------ Car ------------
// Creates a car
function Car(plate, brand, model, color, year, category, status, kmCost, timeCost, creator, picture, location, description, category) {
	this.plate = plate;
	this.brand = brand;
	this.model = model;
	this.color= color;
	this.year = year;
	this.category = category;
	this.status = status;
	this.kmCost = kmCost;
	this.timeCost = timeCost;
	this.creator = creator;
	this.picture = picture;
	this.location = location;
	this.description = description;
	this.status = carStatus.available;
}

// Define Enumeration for car status
var carStatus = {
	AVAILABLE: "available",
	RESERVED: "reserved",
	RENTED: "rented",
	INREPAIR: "inRepair"
}

// Define Enumeration for car brand
var carBrand = {
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
Car.prototype.getCosts = function(kmDriven, hoursDriven) {
	var kmCostCur = kmDriven * this.kmCost;
	var timeCostCur = hoursDriven * this.timeCost;
	var costs = [kmCostCur, timeCostCur];
	return costs;
}


// Calculate air distance of car from given point via latitude and longitude
Car.prototype.calculateDistance = function(latitude, longitude) {
	var disLat = Math.pow(this.location.latitude - latitude, 2);
	var disLon = Math.pow(this.location.longitude - longitude, 2);
	var dis = Math.sqrt(disLat + disLon);
	return dis;
}


// ------------ Location ------------
// Creates a location
function Location (latitude, longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
}


// Testfunctions
//Person.prototype.sayHello1 = function(name) {
//	console.log("Hello, I'm person " +this.firstName);
//}
//
	Customer.prototype.sayHello = function() {
		return "Hello, I'm customer "  + this.firstName;
	}
//// Testcreations
//var customer1 = new Customer("Jenny", "Hendler", "bla", "bla");
//console.log(customer1.sayHello());
//customer1.firstName = "Neu";
//customer1.sayHello();
//console.log(customer1 instanceof Person);
//console.log(customer1 instanceof Customer);
//customer1.sayHello1();
//console.log(customer1.firstName);
//var person1 = new Person("Person", "Mueller", "bla", "bla");
//person1.sayHello1();
//console.log(customer1.status);
//customer1.customerVerified();
//console.log(customer1.status);
// var location1 = new Location(100, 200);
// var car1 = new Car("Plate", location1);
// console.log(location1);
// console.log(car1.location);
// console.log(car1.calculateDistance(50, 50));
// var distance = car1.calculateDistance(50, 50);
// console.log(distance);
