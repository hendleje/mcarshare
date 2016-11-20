exports.reservecar = function(req, res) {
	var customer1 = new Customer("Jenny", "Hendler", "bla", "bla");
	
	// If the user has paid the previous Bill then he is directed to the
	// directions page, otherwise he has to pay the previous bill
	if (customer1.checkPreviousBill() == true) {
		var location1 = new Location(47.33379404, 52.42461880);
		var car1 = new Car("A1B2", "Audi", "1998", "small", 0.4, 5, "Bob",
				"picture", location1, "description");

		var location = car1.location;
		// Set the car status to reserved
		car1.status = "reserved";

		// Open directionToCar page with directionToCar
		//window.location = 'directionToCar.hjs';
		res.render('directiontocar', {bill: 'approved'});
	} else {
		res.render('paybill', {bill: 'not approved'});
	}
};