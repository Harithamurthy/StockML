import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  const features = [
    { icon: "📡", title: "Real-time Data", desc: "Live or regularly updated market data for timely decisions." },
    { icon: "🤖", title: "Prediction Model", desc: "LSTM, Linear Regression and other ML models for short-term forecasting." },
    { icon: "🔖", title: "Watchlist", desc: "Save and monitor your favorite stocks with one click." },
    { icon: "📊", title: "Visualization Dashboard", desc: "Interactive charts and historical vs predicted comparisons." },
  ];

  return (
    <>
      <Navbar />
      <main style={styles.page}>
        <header style={styles.header}>
          <h1 style={styles.title}>About StockVision</h1>
          <p style={styles.subtitle}>AI-powered stock forecasting made simple.</p>
        </header>

        <section style={styles.overview}>
          <p style={styles.paragraph}>
            StockVision is a web-based machine learning platform that helps users forecast stock price
            trends. It analyzes historical market data, applies predictive models, and provides
            data-driven insights to assist in smarter financial decisions.
          </p>

          <p style={styles.tagline}>
            “Predict tomorrow’s market, today — with the power of AI.”
          </p>
        </section>

        <section style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>Key Features</h2>
          <div style={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <div style={styles.featureBody}>
                  <div style={styles.featureName}>{f.title}</div>
                  <div style={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer style={styles.footer}>
          © 2025 StockVision – AI-powered Market Prediction | For Educational Use Only.
        </footer>
      </main>
    </>
  );
};

const styles = {
  page: {
    maxWidth: 1100,
    margin: "1.5rem auto",
    padding: "2.5rem",
    color: "#ffffff",
    background: "#0b1220", /* dark section so white text is visible in light/dark modes */
    borderRadius: 12,
    boxShadow: "0 6px 24px rgba(2,6,23,0.6)",
  },
  header: { marginBottom: "1rem" },
  title: { fontSize: "2rem", margin: 0, color: "#f7fbff" },
  subtitle: { color: "#e6f3ff", marginTop: "0.5rem", opacity: 0.95 },
  overview: { marginTop: "1rem", marginBottom: "2rem" },
  paragraph: { color: "#e6f3ff", lineHeight: 1.6 },
  tagline: { marginTop: "1rem", fontStyle: "italic", color: "#bfe0ff" },
  featuresSection: { marginTop: "1.5rem" },
  featuresTitle: { color: "#ffffff", marginBottom: "1rem" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" },
  featureCard: { display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "#08121a", padding: "1rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" },
  featureIcon: { fontSize: "1.6rem" },
  featureName: { fontWeight: 700, color: "#ffffff" },
  featureDesc: { color: "#e6f3ff", opacity: 0.9 },
  featureBody: { minHeight: 0 },
  footer: { marginTop: "2rem", color: "#9fb0d6", fontSize: "0.9rem" },
};

export default About;
