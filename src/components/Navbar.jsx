import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <a href="/" style={styles.brand}>
        <span style={styles.brandLogo}>💡</span>
        <span style={styles.brandText}>SmartStock</span>
      </a>

      <ul style={styles.menu}>
        <li><a href="/" style={styles.link}>🏠 Home</a></li>
        <li><a href="/dashboard" style={styles.link}>� Dashboard</a></li>
        <li><a href="/prediction" style={styles.link}>📈 Predictions</a></li>
        <li><a href="/news" style={styles.link}>📰 News</a></li>
        <li><a href="/about" style={styles.link}>ℹ️ About</a></li>
        {/* <li><a href="/login" style={styles.auth}>🔐 Login / Signup</a></li> */}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.25rem",
    background: "linear-gradient(90deg, #0f1724 0%, #0b1220 100%)",
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    /* keep navbar visible and in flow so it doesn't cover content */
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    color: "#fff",
  },
  brandLogo: { fontSize: "1.35rem" },
  brandText: { fontWeight: 700, fontSize: "1.1rem" },
  menu: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#e6f3ff",
    textDecoration: "none",
    padding: "0.5rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.95rem",
  },
  auth: {
    background: "linear-gradient(90deg,#6b73ff,#3b82f6)",
    color: "#fff",
    padding: "0.45rem 0.8rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
};

export default Navbar;
