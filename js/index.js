t = L.latLngBounds([0, 0], [-90, 90]);

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

var sidebar = L.control.sidebar({
	autopan: false,       // whether to maintain the centered map point when opening the sidebar
	closeButton: true,    // whether t add a close button to the panes
	container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
	position: 'left',     // left or right
}).addTo(map);

L.control.attribution({
	prefix: "<a href='https://github.com/gsmap/gsmap-r' target='_blank'>github</a>"
}).addTo(map);
/*
var imageUrl = 'https://cdn.jsdelivr.net/gh/gsmap/gsmap_tiles@1.1/tiles/low_teyvat.webp',
	imageBounds = [[0, 0], [-66.5, -90]];
L.imageOverlay(imageUrl, t).addTo(map);
*/
L.TileLayer.T = L.TileLayer.extend({
	getTileUrl: function (coords) {
		return `https://cdn.jsdelivr.net/gh/gsmap/gsmap_tiles@1.1/tiles/${coords.z}/${coords.x}_${coords.y}.webp`;
	},
	reuseTiles: true
});

L.tileLayer.t = function () {
	return new L.TileLayer.T()
};

map.addLayer(L.tileLayer.t());
fetch("js/coord.json").then(response => response.json()
	.then(table => {
		raw = table, data = table.data, doc = document
		for (const e in data) {
			var l = data[e].length,
			get=0;
			doc.getElementById(`${e}-max`).innerHTML = l
			for (let i = 0; i < l; i++) {
				if (localStorage[`${e}-${i}`]) {
					get++
				}
			};
			doc.getElementById(`${e}-current`).innerHTML = get
		}
	})
);

var icon_checkbox = document.querySelectorAll(".icon-checkbox");
icon_checkbox.forEach(e => {
	e.addEventListener("click", icon_toggle)
});

function icon_toggle() {
	var icon_data = this.dataset.icon.split("-"),
		category = icon_data[0],
		symbol = icon_data[1],
		color = icon_data[2];
	draw_icon(category, symbol, color, this.checked)
};

function draw_icon(category, symbol, color, state) {
	var obj = data[category];
	if (!this[`${category}-mark`]) {
		this[`${category}-mark`] = L.layerGroup().addTo(map);
		for (const e in obj) {
			var id = obj[e].id,
				coord_x = obj[e].geometry.coordinates[0],
				coord_y = obj[e].geometry.coordinates[1],
				cache = `${category}-${id}`, opacity = "";
			if (localStorage[cache]) {
				opacity = "op-50"
			};
			L.marker(
				[coord_x, coord_y],
				{
					icon: L.AwesomeMarkers.icon({
						shadowAnchor: [0, 0],
						shadowSize: [0, 0],
						icon: symbol,
						markerColor: color,
						iconColor: '#fff',
						className: `awesome-marker ` +
							`${cache} ` +
							`${opacity}`
					})
				}
			).bindPopup(
				`${cache}` +
				`<br>` +
				`<label class="switch">` +
				`	<input type="checkbox">` +
				`	<span class="slider"></span>` +
				`</label>`
			).addTo(window[`${category}-mark`])
		}
	}
	if (state) {
		map.addLayer(window[`${category}-mark`]);
	} else {
		map.removeLayer(window[`${category}-mark`]);
	}
};

map.on("popupopen", function (e) {
	var id = e.popup._source._icon.classList[2],
	category = id.split("-")[0];
	if (localStorage[id]) {
		e.target._popup._container.querySelector("input").checked = true
	};
	e.target._popup._container.querySelector("input").addEventListener("click", () => {
		e.popup._source._icon.classList.toggle("op-50");
		if (localStorage[id]) {
			localStorage.removeItem(id)
			document.getElementById(`${category}-current`).innerHTML--
		} else {
			localStorage[id] = true
			document.getElementById(`${category}-current`).innerHTML++
		}
	});
});
