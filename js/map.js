// MAP.JS to visualize the world airports and the forbidden and restricted zones for flying multicopter drones

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

// Scale Control
var scaleOptions = {
	position: 'bottomright',     // The position of the control
	maxWidth: 150,     // Def: 100 - Maximum width in pixels
	metric: true,     // metric scale line (m/km)
	imperial: false,     // imperial scale line (mi/ft)
	updateWhenIdle: false     // If true updated on moveend, else on move
};
map.addControl( new L.Control.Scale(scaleOptions) );

// Create Layers
var airportsLayer = L.geoJson.css().addTo(map);
var noFlyLayer = L.layerGroup().addTo(map);
var hiRestLayer = L.layerGroup().addTo(map);

// Features
var airports = [];
var noFly = [];
var hiRest = [];

//Styles
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

// Create map features
function getFeatures() {
	// Calculate No Fly zones
	function getNoFlyZone (c, r) {
		var z = L.circle([c[1],c[0]],r,noFlyStyle);	// create circle feature
		noFly[noFly.length] = z;	// keep track of features
		z.addTo(noFlyLayer);
	}
	// Calculate high restriction fly zones
	function getHiRestZone (c) {
		var z = L.circle([c[1],c[0]],8000,hiRestStyle);	// create circle feature
		hiRest[hiRest.length] = z;	// keep track of features
		z.addTo(hiRestLayer);
	}
	// Create Airport features
	for (i in nfzo) {
		// create GeoJSON feature
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
			popupTemplate: "<strong>{name}</strong><br>City: {city}<br>Country: {country}<br>Category {category}"	// feature popup
		};
		if (o.properties.category == 'A') {
			o.style = airportStyleA;
			getNoFlyZone(o.geometry.coordinates,2500);	// calculate no fly zone with rad. 2500
			getHiRestZone(o.geometry.coordinates);	// calculate high restriction fly zone with rad. 8000
		} else if (o.properties.category == 'B') {
			o.style = airportStyleB;
			getNoFlyZone(o.geometry.coordinates,1600);	// calculate no fly zone with rad. 1600
		}
		airports[i] = L.geoJson.css(o,{});	// create airport layer feature and keep track of it
		airports[i].addTo(airportsLayer);
	}
	
};

getFeatures();
