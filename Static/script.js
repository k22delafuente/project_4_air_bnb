// Load Plotly visualizations
fetch("/price_dist.json")
    .then(res => res.json())
    .then(fig => Plotly.newPlot("priceDist", fig.data, fig.layout));

fetch("/feature_importance.json")
    .then(res => res.json())
    .then(fig => Plotly.newPlot("featureImportance", fig.data, fig.layout));

// Leaflet Map
const map = L.map("map").setView([36.1699, -115.1398], 11); // Las Vegas coords
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

// Handle prediction form
document.getElementById("predictForm").addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
        minimum_nights: +document.getElementById("minimum_nights").value,
        number_of_reviews: +document.getElementById("number_of_reviews").value,
        reviews_per_month: +document.getElementById("reviews_per_month").value,
        room_type: document.getElementById("room_type").value
    };

    const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    const div = document.getElementById("predictionResult");
    div.classList.remove("d-none");
    div.innerHTML = `<strong>Estimated Nightly Price: $${result.predicted_price}</strong>`;
});
