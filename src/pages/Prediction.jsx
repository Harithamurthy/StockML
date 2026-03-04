import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { getPrediction } from "../services/predictionService";

const STOCKS = [
  "RELIANCE.NS", "TCS.NS", "INFY.NS", "ICICIBANK.NS", "HDFCBANK.NS",
  "BAJFINANCE.NS", "WIPRO.NS", "TATAMOTORS.NS", "TECHM.NS", "AXISBANK.NS"
];

const Prediction = () => {
  const [selectedStock, setSelectedStock] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!selectedStock) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getPrediction(selectedStock);
      setPrediction(result);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.bg}>
        <div style={styles.wrapper}>
          <h1 style={styles.title}>Stock Price Prediction</h1>
          <div style={styles.controls}>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a stock</option>
              {STOCKS.map((stock) => (
                <option key={stock} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
            <button
              onClick={handlePredict}
              disabled={!selectedStock || loading}
              style={{
                ...styles.button,
                opacity: !selectedStock || loading ? 0.7 : 1,
                cursor: !selectedStock || loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {prediction && (
            <div style={styles.results}>
              <h2 style={styles.subtitle}>
                Prediction Results for {prediction.ticker}
              </h2>
              <div style={styles.predictionCards}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Linear Regression Model</h3>
                  <p style={styles.price}>
                    <span style={{ color: "#7bee81" }}>Next Day Predicted Price: </span>
                    ₹{prediction.prediction.linear_regression.toFixed(2)}
                  </p>
                  <p style={styles.acc}>Accuracy: <span style={{ color: "#ffd166" }}>{(prediction.accuracy.lr_r2 * 100).toFixed(2)}%</span></p>
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>LSTM Model</h3>
                  <p style={styles.price}>
                    <span style={{ color: "#7bee81" }}>Next Day Predicted Price: </span>
                    ₹{prediction.prediction.lstm.toFixed(2)}
                  </p>
                  <p style={styles.acc}>Accuracy: <span style={{ color: "#ffd166" }}>{(prediction.accuracy.lstm_r2 * 100).toFixed(2)}%</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #101826 65%, #14213d 100%)",
    paddingTop: "4rem",
    paddingBottom: "4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    background: "rgba(30, 33, 56, 0.92)",
    boxShadow: "0px 6px 25px 0px rgba(0,0,0,0.18)",
    borderRadius: 18,
    padding: "2.5rem 2rem",
    maxWidth: 420,
    minWidth: 320,
    margin: "1.5rem auto",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "2.15rem",
    marginBottom: "2rem",
    fontWeight: 700,
    letterSpacing: "0.6px",
    color: "#fff",
  },
  controls: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  select: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1.5px solid #243056",
    background: "#19223d",
    color: "#fff",
    width: "185px",
    fontSize: "1rem",
    fontWeight: 500,
  },
  button: {
    padding: "0.75rem 1.4rem",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(90deg, #47bdd9 0%, #2dce7e 100%)",
    color: "#fff",
    fontWeight: 600,
    letterSpacing: "0.5px",
    fontSize: "1rem",
    transition: "background 0.2s, opacity 0.15s",
    boxShadow: "0 2px 10px 0 rgba(72,178,216,0.06)",
  },
  results: {
    marginTop: "2.5rem",
  },
  subtitle: {
    fontSize: "1.15rem",
    color: "#90caf9",
    marginBottom: "1.1rem",
    fontWeight: 600,
  },
  predictionCards: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.3rem",
  },
  card: {
    background: "rgba(22, 27, 46, 0.98)",
    padding: "1.6rem 1.1rem",
    borderRadius: "14px",
    border: "1.2px solid #215c6f",
    boxShadow: "0 2px 10px 0 rgba(67,216,213,0.13)",
    textAlign: "left"
  },
  cardTitle: {
    fontSize: "1.08rem",
    color: "#ffd166",
    marginBottom: "0.55rem",
    fontWeight: 600,
  },
  price: {
    fontSize: "1.15rem",
    fontWeight: 500,
    margin: "0.8rem 0 0.4rem 0",
  },
  acc: {
    fontSize: "1.03rem",
    marginBottom: 0
  },
  error: {
    color: "#fc8181",
    marginTop: "1rem",
    fontWeight: 500,
  },
};

export default Prediction;
