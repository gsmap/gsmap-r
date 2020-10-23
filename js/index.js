t = L.latLngBounds([0, 0], [-66.5, 90]);
var raw, data, map = L.map("map", {
	center: [-35, 45],
	zoomDelta: 0.5,
	zoomSnap: 0.5,
	maxZoom: 8,
	minZoom: 3,
	zoom: 5,
	maxBounds: t,
	attributionControl: false,
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft'
	}
});
L.control.attribution({
	prefix: "<a href='https://github.com/gsmap/gsmap-r' target='_blank'>github</a>"
}).addTo(map);
var imageUrl = 'https://cdn.jsdelivr.net/gh/gsmap/gsmap_tiles@1.1/tiles/low_teyvat.webp',
	imageBounds = [[0, 0], [-66.5, -90]];
L.imageOverlay(imageUrl, t).addTo(map);
/* old
L.TileLayer.T = L.TileLayer.extend({
	getTileUrl: function (coords) {
		return `https://cdn.jsdelivr.net/gh/gsmap/gsmap_tiles@1.1/tiles/${coords.z}/${coords.x}_${coords.y}.webp`;
	},
	reuseTiles: true
});
L.TileLayer.T = L.TileLayer.extend({
	getTileUrl: function (coords) {
	return `tiles/${coords.z}/${coords.x}_${coords.y}.webp`;
	},
	reuseTiles: true
});
L.tileLayer.t = function () {
	return new L.TileLayer.T()
};
map.addLayer(L.tileLayer.t());
*/
fetch("js/coord.json").then(response => response.json()
	.then(table => {
		raw = table, data = table.data
		drawlayer("anemoculus", "bahai", "green")
	})
);
function drawlayer(category, symbol, color) {
	for (const e in data[category]) {
		var id = data[category][e].id,
			coord_x = data[category][e].geometry.coordinates[0],
			coord_y = data[category][e].geometry.coordinates[1],
			cache = `${category}_${id}`, opacity = "";
		if (localStorage[cache]) {
			opacity = "op-50"
		}
		L.marker(
			[coord_x, coord_y],
			{
				icon: L.AwesomeMarkers.icon({
					shadowAnchor: [0, 0],
					shadowSize: [0, 0],
					icon: symbol,
					markerColor: color,
					className: `awesome-marker ${cache} ${opacity}`
				})
			}
		).addTo(map).bindPopup(`
		${cache}
		<br>
		<label class="switch">
			<input type="checkbox">
			<span class="slider"></span>
		</label>
		`)
	}
};
map.on("popupopen", function (e) {
	var id = e.popup._source._icon.classList[2];
	//console.log(id.split("_"))
	if (localStorage[id]) {
		e.target._popup._container.querySelector("input").checked = true
	};
	e.target._popup._container.querySelector("input").addEventListener("click", () => {
		e.popup._source._icon.classList.toggle("op-50");
		if (localStorage[id]) {
			localStorage.removeItem(id)
		} else {
			localStorage[id] = true
		}
	});
})