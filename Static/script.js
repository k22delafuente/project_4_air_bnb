// Load Plotly JSON charts
function loadChart(endpoint, containerId) {
    fetch(endpoint)
        .then(res => res.json())
        .then(fig => Plotly.newPlot(containerId, fig.data, fig.layout));
}

loadChart("/price_dist.json", "priceDist");
loadChart("/room_type_distribution.json", "roomTypeDist");
loadChart("/avg_price_by_neighbourhood.json", "avgPriceNeighborhood");
loadChart("/reviews_vs_price.json", "reviewsVsPrice");
loadChart("/availability_heatmap.json", "availabilityHeatmap");

// Leaflet Map
const map = L.map("map").setView([36.1699, -115.1398], 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

fetch("/listings.geojson")
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                const price = feature.properties.price;
                const color = price < 100 ? "green" : price < 200 ? "orange" : "red";
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: color,
                    fillOpacity: 0.8,
                    color: "#000",
                    weight: 1
                }).bindPopup(`$${price}`);
            }
        }).addTo(map);
    });
