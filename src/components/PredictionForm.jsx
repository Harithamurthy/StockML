import React, { useState } from "react";
import { getPrediction } from "../utils/api";

const PredictionForm = ({ onPrediction }) => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getPrediction(symbol);
      onPrediction(result); // send prediction to parent
    } catch (err) {
      setError("Failed to get prediction.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Enter Stock Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        style={styles.input}
      />
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </form>
  );
};

const styles = {
  form: { display: "flex", flexDirection: "column", gap: "1rem", width: "300px", margin: "1rem auto" },
  input: { padding: "0.5rem", fontSize: "1rem" },
  button: { padding: "0.5rem", fontSize: "1rem", cursor: "pointer" },
  error: { color: "red" },
};

export default PredictionForm;
