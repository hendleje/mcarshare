// ------------ Location ------------
// Creates a location
function Location (latitude, longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
}

//Calculate air distance of location to given point
Location.prototype.distanceto = function(lat, lng) {
	var earthRadius = 6371000; //meters
    var dLat = this.toRadians(this.latitude-lat);
    var dLng = this.toRadians(this.longitude-lng);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(this.toRadians(lat)) * Math.cos(this.toRadians(lat)) *
               Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var dist = Math.round(earthRadius * c * 100)/100;

    return dist;
}

// Calculates the distance between two points in metres
Location.prototype.distancebetween = function (lat1, lng1, lat2, lng2) {
    var earthRadius = 6371000; //meters
    var dLat = this.toRadians(lat2-lat1);
    var dLng = this.toRadians(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
               Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var dist = Math.round(earthRadius * c * 100)/100;

    return dist;
}

Location.prototype.toRadians = function(number) {
    return number * Math.PI / 180;
}

module.exports = Location;

// Test
//loc = new Location(47.574058, -52.732927);
//var dist = loc.distancebetween(47.574058, -52.732927, 47.560040, -52.752949);
//console.log(dist);
//var dist2 = loc.distanceto(47.560040, -52.752949);
//console.log(dist2);