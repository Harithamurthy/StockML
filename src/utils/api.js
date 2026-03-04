import axios from "axios";

// Base URL of your backend
const BASE_URL = "http://localhost:5000/api"; // Change port if your backend uses another

/**
 * Get stock prediction for a symbol
 * @param {string} symbol - Stock symbol (e.g., AAPL)
 * @returns {Promise<Array>} - Returns predicted data array
 */
export const getPrediction = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/predict/${symbol}`);
    return response.data; // Expecting array of { date, price }
  } catch (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }
};

/**
 * Get historical stock data for a symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Array>} - Returns historical data array
 */
export const getHistoricalData = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/historical/${symbol}`);
    return response.data; // Expecting array of { date, price }
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};
