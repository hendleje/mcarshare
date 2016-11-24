// ------------ Location ------------
// Creates a location
function Location (latitude, longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
}

//Calculate air distance of location from given point
Location.prototype.calculatedistance = function(latitude, longitude) {
	console.log("lat1: " +latitude+ " long1: " +longitude);
	console.log("lat2: " +this.latitude+ " long2: " +this.longitude);
	var disLat = Math.pow(this.latitude - latitude, 2);
	var disLon = Math.pow(this.longitude - longitude, 2);
	var dis = Math.sqrt(disLat + disLon);
	console.log(dis);
	return dis;
}

module.exports = Location;