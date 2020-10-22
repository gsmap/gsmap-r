t = L.latLngBounds([0, 0], [-66.5, 90]);
var raw,data,map = L.map("map", {
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
L.control.attribution({
	prefix: "<a href='https://github.com/gsmap/gsmap-r' target='_blank'>github</a>"
}).addTo(map);
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

fetch("js/coord.json").then(response => response.json()
	.then(table => {
		raw =  table,data = table.data
		drawlayer("바람신의 눈","bahai","green")
	})
);
function drawlayer(category,symbol,color) {
	for (const e in data[category]) {
		var id = data[category][e].id,
			coord_x = data[category][e].geometry.coordinates[0],
			coord_y = data[category][e].geometry.coordinates[1]
		console.log(coord_y)
		L.marker(
			[coord_x, coord_y],
			{icon: L.AwesomeMarkers.icon({
				icon: symbol,
				markerColor: color,
				className: `awesome-marker mark_${category}_${id}`
			})}
		).addTo(map).bindPopup(`${category} - ${id}`)
	}
}