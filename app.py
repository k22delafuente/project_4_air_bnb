from flask import Flask, request, jsonify, render_template, send_file
import pandas as pd
import joblib

app = Flask(__name__)

model = joblib.load("airbnb_rf_model.pkl")
columns = joblib.load("feature_columns.pkl")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    df = pd.DataFrame([data])
    df = pd.get_dummies(df)

    # Add missing dummy columns
    for col in columns:
        if col not in df:
            df[col] = 0

    df = df[columns]
    prediction = model.predict(df)[0]
    return jsonify({"predicted_price": round(prediction, 2)})

@app.route("/price_dist.json")
def price_dist():
    return send_file("price_dist.json")

@app.route("/feature_importance.json")
def feature_importance():
    return send_file("feature_importance.json")

@app.route("/listings.geojson")
def geojson():
    return send_file("listings.geojson")

if __name__ == "__main__":
    app.run(debug=True)
