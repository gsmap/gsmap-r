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
/*
L.TileLayer.T = L.TileLayer.extend({
	getTileUrl: function (coords) {
	return `tiles/${coords.z}/${coords.x}_${coords.y}.webp`;
	},
	reuseTiles: true
});
*/
L.tileLayer.t = function () {
	return new L.TileLayer.T()
};
map.addLayer(L.tileLayer.t());
fetch("js/coord.json").then(response => response.json()
	.then(table => {
		raw =  table,data = table.data
		drawlayer("anemoculus","bahai","green")
	})
);
function drawlayer(category,symbol,color) {
	for (const e in data[category]) {
		var id = data[category][e].id,
			coord_x = data[category][e].geometry.coordinates[0],
			coord_y = data[category][e].geometry.coordinates[1],
			cache = `${category}_${id}`,opacity = "";
		if (localStorage[cache]) {
			opacity = "op-50"
		}
		L.marker(
			[coord_x, coord_y],
			{icon: L.AwesomeMarkers.icon({
				icon: symbol,
				markerColor: color,
				className:`awesome-marker ${category}_${id} ${opacity}`
			})}
		).addTo(map).bindPopup(`
		<label class="switch">
			<input type="checkbox">
			<span class="slider"></span>
		</label>
		`)
	}
};
var marker,switch_c;
map.on("popupopen", function (e) {
	e.target._popup._container.querySelector("input").addEventListener("click",()=>{
		var id = e.popup._source._icon.classList[2];
		e.popup._source._icon.classList.toggle("op-50")
		if (localStorage[id]){
			localStorage.removeItem("anemoculus_1")
		} else {
			localStorage[id] = true
		}
	});
})