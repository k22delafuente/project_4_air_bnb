from flask import Flask, render_template, send_file

app = Flask(__name__)  
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/price_dist.json")
def price_dist():
    return send_file("price_dist.json")

@app.route("/room_type_distribution.json")
def room_type():
    return send_file("room_type_distribution.json")

@app.route("/avg_price_by_neighbourhood.json")
def avg_price():
    return send_file("avg_price_by_neighbourhood.json")

@app.route("/reviews_vs_price.json")
def reviews_price():
    return send_file("reviews_vs_price.json")

@app.route("/availability_heatmap.json")
def availability_heat():
    return send_file("availability_heatmap.json")

@app.route("/listings.geojson")
def listings():
    return send_file("listings.geojson")

if __name__ == "__main__":
    app.run(debug=True)
