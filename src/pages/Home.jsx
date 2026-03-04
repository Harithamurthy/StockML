import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.heroLeft}>
              <h1 style={styles.title}>SmartStock — AI forecasts made simple</h1>
              <p style={styles.subtitle}>
                Clean, actionable stock predictions and market insights powered by transparent ML models.
              </p>
              <div style={styles.ctaRow}>
                <a href="/dashboard" style={styles.button}>Explore Dashboard</a>
                <a href="/prediction" style={styles.buttonSecondary}>Try Predictions</a>
              </div>
            </div>
            <div style={styles.heroRight}>
              <div style={styles.placeholderGraphic} aria-hidden="true">📊</div>
            </div>
          </div>

          <div style={styles.mainContent}>
            {/* Grid with focused features: removed Portfolio and Education per request */}
            <div style={styles.gridContainer}>
              <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>MARKET ANALYSIS</span>
                  <h3 style={styles.cardTitle}>NIFTY50 Analysis</h3>
                  <p style={styles.cardDesc}>Real-time market data, technical indicators and clear summaries.</p>
                  <a href="/dashboard" style={styles.learnMore}>Explore</a>
                </div>
              </div>

              <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>AI PREDICTIONS</span>
                  <h3 style={styles.cardTitle}>Smart Predictions</h3>
                  <p style={styles.cardDesc}>Interpretable models that forecast short and medium term price movement.</p>
                  <a href="/prediction" style={styles.learnMore}>Try it</a>
                </div>
              </div>

              {/* <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>SCREENING</span>
                  <h3 style={styles.cardTitle}>Stock Scanner</h3>
                  <p style={styles.cardDesc}>Filter stocks by momentum, volume, fundamentals and AI confidence score.</p>
                  <a href="/dashboard" style={styles.learnMore}>Open scanner</a>
                </div>
              </div> */}

              <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>NEWS</span>
                  <h3 style={styles.cardTitle}>Market News</h3>
                  <p style={styles.cardDesc}>Curated news and event summaries that matter to your portfolio.</p>
                  <a href="/news" style={styles.learnMore}>Read</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    background: "#ffffff",
    color: "#2d3436",
    boxSizing: "border-box",
    /* small top padding for breathing room beneath navbar; nav is sticky so large padding isn't needed */
    paddingTop: "16px",
  },
  hero: {
    width: "100%",
    background: "linear-gradient(180deg,#f8fafc 0%, #f1f5f9 100%)",
    minHeight: "360px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2.5rem 1rem",
    color: "#0f1724",
    position: "relative",
  },
  heroInner: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    gap: "2rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  heroLeft: {
    flex: "1 1 480px",
    minWidth: "280px",
  },
  heroRight: {
    flex: "0 0 320px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderGraphic: {
    width: "220px",
    height: "140px",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#fff,#eef2ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2.5rem",
    color: "#64748b",
    boxShadow: "0 8px 30px rgba(2,6,23,0.06)",
  },
  card: {
    width: "100%",
    maxWidth: "800px",
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.4rem",
    margin: "0 0 1rem 0",
    color: "#0f1724",
    fontWeight: 700,
    lineHeight: 1.15,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#334155",
    maxWidth: "680px",
    margin: "0 0 1.25rem 0",
    lineHeight: 1.6,
  },
  ctaRow: { 
    display: "flex", 
    gap: "1rem", 
    alignItems: "center", 
    justifyContent: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.72rem 1.1rem",
    backgroundColor: "#0f1724",
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.98rem",
    borderRadius: "8px",
    fontWeight: 600,
    transition: "all 0.18s ease",
    boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
  },
  buttonSecondary: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.6rem 0.9rem",
    backgroundColor: "transparent",
    color: "#0f1724",
    textDecoration: "none",
    fontSize: "0.98rem",
    borderRadius: "8px",
    fontWeight: 600,
    border: "1px solid #e2e8f0",
    marginLeft: "0.75rem",
  },
  mainContent: {
    width: "100%",
    maxWidth: "1200px",
    margin: "2.25rem auto 0",
    padding: "0 1rem",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
    padding: "1rem",
    margin: "0 auto",
  },
  gridCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.6rem",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(2,6,23,0.06)",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cardLabel: {
    color: "#0056b3",
    fontSize: "0.9rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#0f1724",
    margin: "0.5rem 0",
    fontWeight: 700,
  },
  cardDesc: {
    color: "#475569",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "1rem",
  },
  learnMore: {
    display: "inline-block",
    color: "#0056b3",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 0",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s ease",
    "&:hover": {
      borderBottom: "2px solid #0056b3",
    },
  },
};

export default Home;