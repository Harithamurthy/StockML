import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import News from "./pages/News";
import About from "./pages/About";

const App = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Home />} />

      {/* Dashboard for stock predictions */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Prediction page */}
      <Route path="/prediction" element={<Prediction />} />

  {/* News page */}
  <Route path="/news" element={<News />} />

        {/* About page */}
        <Route path="/about" element={<About />} />

      {/* Optional: fallback route */}
      <Route
        path="*"
        element={
          <div style={styles.notFound}>
            <h2>404 - Page Not Found</h2>
            <a href="/" style={styles.link}>Go Home</a>
          </div>
        }
      />
    </Routes>
  );
};

const styles = {
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    textAlign: "center",
    padding: "2rem",
  },
  link: {
    marginTop: "1rem",
    textDecoration: "none",
    color: "#1a1a1a",
    fontWeight: "bold",
  },
};

export default App;
