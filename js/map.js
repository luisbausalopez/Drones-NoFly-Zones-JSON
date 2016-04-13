// MAP

//Basemap layer
var blOptions = {
	name: 'Light Grey',
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	maxZoom: 25,
	minZoom: 1
}
var baselayer = L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", blOptions);
//Map options
var mapOptions = {
	"center": [25, 15],		// latitude, longitude
	"zoom": 4,
	"minZoom": 1,
	"maxZoom": 22,
	"zoomControl": true,
	//"crs": mapCrs,
	"layers": baselayer,	// in order to load the map you need to pass it at least one layer, which will be a basemap layer. You can also pass it multiple layers or add them later.
	"attributionControl": true,
	"fadeAnimation": true,
	"zoomAnimation": true,
	"markerZoomAnimation": true,
	"zoomAnimationThreshold": 2
};
// Create map
var map = L.map('map', mapOptions);

// Create Layers
var airportsLayer = L.geoJson.css().addTo(map);
var noFlyLayer = L.layerGroup().addTo(map);
var hiRestLayer = L.layerGroup().addTo(map);

// Features
var airports = [];
var noFly = [];
var hiRest = [];

var airportStyleA = {
	icon: {
		iconUrl: 'img/airplane-trans-blue.png',
		iconSize: [20, 20],
		iconAnchor: [10, 10]
	}
};
var airportStyleB = {
	icon: {
		iconUrl: 'img/airplane-trans-grey.png',
		iconSize: [18, 18],
		iconAnchor: [9, 9]
	}
};
var noFlyStyle = {
	"color": "#E74C3C",
	"weight": 3,
	"fill-opacity": 0.6,
	"opacity": 1
};
var hiRestStyle = {
	"color": "#3498DB",
	"weight": 2,
	"fill-opacity": 0.4,
	"opacity": 0.8
};

function getFeatures() {
	function getNoFlyZone (c, r) {
		//var z = L.circle(L.latlng(c[0],c[1]),r,noFlyStyle);
		//var z = L.circle(c,r,noFlyStyle);
		var z = L.circle([c[1],c[0]],r,noFlyStyle);
		noFly[noFly.length] = z;
		z.addTo(noFlyLayer);
	}
	function getHiRestZone (c) {
		//var z = L.circle(L.latlng(c[0],c[1]),1600,hiRestStyle);
		//var z = L.circle(c,1600,hiRestStyle);
		var z = L.circle([c[1],c[0]],8000,hiRestStyle);
		hiRest[hiRest.length] = z;
		z.addTo(hiRestLayer);
	}
	for (i in nfzo) {
		var o = {
			type: "Feature",
			geometry: {
				type: 'Point',
				coordinates: [nfzo[i].longitude,nfzo[i].latitude]
			},
			properties: {
				name: nfzo[i].airport,
				city: nfzo[i].city,
				country: nfzo[i].country,
				category: nfzo[i].category
			},
			popupTemplate: "<strong>{name}</strong><br>City: {city}<br>Country: {country}<br>Category {category}"
		};
		if (o.properties.category == 'A') {
			o.style = airportStyleA;
			getNoFlyZone(o.geometry.coordinates,2500);
			getHiRestZone(o.geometry.coordinates);
		} else if (o.properties.category == 'B') {
			o.style = airportStyleB;
			getNoFlyZone(o.geometry.coordinates,1600);
		}
		airports[i] = L.geoJson.css(o,{});
		airports[i].addTo(airportsLayer);
	}
	
};

getFeatures();