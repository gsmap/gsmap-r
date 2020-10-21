t = L.latLngBounds([0, 0], [-66.5, 90]);
var map = L.map("map", {
	//crs: L.CRS.Simple,
	center: [-35, 45],
	zoomDelta: 0.5,
	zoomSnap: 0.5,
	maxZoom: 8,
	minZoom: 3,
	zoom: 5,
	maxBounds: t,
	attributionControl: false,
	zoomControl: false
});
L.control.zoom({
	zoomInTitle: '+',
	zoomOutTitle: '-'
}).addTo(map);
L.TileLayer.T = L.TileLayer.extend({
	getTileUrl: function (coords) {
	return `https://cdn.jsdelivr.net/gh/gsmap/gsmap_tiles@1.0/tiles/${coords.z}/${coords.x}_${coords.y}.webp`;
	},
	reuseTiles: true
});
L.tileLayer.t = function () {
return new L.TileLayer.T();
}
map.addLayer(L.tileLayer.t());
var redMarker = L.AwesomeMarkers.icon({
	icon: 'bahai',
	markerColor: 'red'
}); 
L.marker(["-20.64306554672647", "43.09936523437501"], {icon: redMarker}).addTo(map);