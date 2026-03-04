import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { fetchNews } from "../services/newsApi";
import { STOCK_DISPLAY_NAMES } from '../constants/stocks';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchNews();
        setNews(newsData);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const filtered = useMemo(() => {
    return news.filter((n) => {
      const matchesQuery =
        !query || n.company.toLowerCase().includes(query.toLowerCase()) ||
        n.title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "all" ? true : n.sentiment === filter;
      const matchesCompany = selectedCompany === "all" || n.company === STOCK_DISPLAY_NAMES[selectedCompany];
      return matchesQuery && matchesFilter && matchesCompany;
    });
  }, [news, query, filter, selectedCompany]);

  const sentimentCounts = useMemo(() => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    news.forEach((n) => (counts[n.sentiment] = (counts[n.sentiment] || 0) + 1));
    const total = news.length || 1;
    return {
      positive: Math.round((counts.positive / total) * 100),
      neutral: Math.round((counts.neutral / total) * 100),
      negative: Math.round((counts.negative / total) * 100),
    };
  }, [news]);

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <h1 style={styles.title}>📰 Stock Market News & Insights</h1>
          <p style={styles.subtitle}>
            Stay updated with the latest trends, financial reports, and company movements.
          </p>
        </header>

        <section style={styles.filterSection}>
          <div style={styles.filterRow}>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Companies</option>
              {Object.entries(STOCK_DISPLAY_NAMES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            <input
              aria-label="Filter news by company name"
              placeholder="Filter news by company name (e.g., RELIANCE, TCS, INFY...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.search}
            />

            <div style={styles.filterButtons}>
              <button
                onClick={() => setFilter("all")}
                style={{
                  ...styles.filterBtn,
                  ...(filter === "all" ? styles.activeFilter : {}),
                }}
              >
                🟢 All News
              </button>
              <button
                onClick={() => setFilter("positive")}
                style={{
                  ...styles.filterBtn,
                  ...(filter === "positive" ? styles.positiveFilter : {}),
                }}
              >
                🔵 Positive Sentiment
              </button>
              <button
                onClick={() => setFilter("neutral")}
                style={{
                  ...styles.filterBtn,
                  ...(filter === "neutral" ? styles.neutralFilter : {}),
                }}
              >
                🟠 Neutral Sentiment
              </button>
              <button
                onClick={() => setFilter("negative")}
                style={{
                  ...styles.filterBtn,
                  ...(filter === "negative" ? styles.negativeFilter : {}),
                }}
              >
                🔴 Negative Sentiment
              </button>
            </div>
          </div>
        </section>

        <main style={styles.main}>
          <div style={styles.feed}>
            {loading ? (
              <div style={styles.empty}>Loading news...</div>
            ) : error ? (
              <div style={styles.empty}>{error}</div>
            ) : filtered.length === 0 ? (
              <div style={styles.empty}>No news found for this filter.</div>
            ) : (
              filtered.map((n) => (
                <article key={n.id} style={styles.card}>
                  <div style={styles.cardHead}>
                    <h3 style={styles.newsTitle}>{n.title}</h3>
                    <div style={styles.sentiment}>{sentimentDot(n.sentiment)}</div>
                  </div>
                  <p style={styles.snippet}>{n.snippet}</p>
                  <div style={styles.metaRow}>
                    <span style={styles.metaDate}>{n.date}</span>
                    <span style={styles.metaCompany}>{n.company}</span>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside style={styles.sidebar}>
            <div style={styles.insightsCard}>
              <h4 style={styles.insightsTitle}></h4>
              <p style={styles.insightText}></p>
              <p style={styles.insightText}></p>
              <p style={styles.insightText}></p>
            </div>

            <div style={styles.pieCard}>
              <h4 style={styles.insightsTitle}>Sentiment Overview</h4>
              <div style={styles.pieRow}>
                <div style={{...styles.pieBar, background: '#4ade80', width: `${sentimentCounts.positive}%`}} />
                <div style={{...styles.pieBar, background: '#f59e0b', width: `${sentimentCounts.neutral}%`}} />
                <div style={{...styles.pieBar, background: '#ff6b6b', width: `${sentimentCounts.negative}%`}} />
              </div>
              <div style={styles.pieLegend}>
                <span>Positive: {sentimentCounts.positive}%</span>
                <span>Neutral: {sentimentCounts.neutral}%</span>
                <span>Negative: {sentimentCounts.negative}%</span>
              </div>
            </div>

            <div style={styles.linksCard}>
              <a href="/dashboard" style={styles.link}>Back to Dashboard</a>
              <a href="/prediction" style={styles.link}>View Predictions</a>
              <a href="/about" style={styles.link}>About SmartStock</a>
              {/* <a href="/contact" style={styles.link}>Contact Support</a> */}
            </div>
          </aside>
        </main>

        <footer style={styles.footer}>
          © 2025 SmartStock – AI-powered Market Prediction | For Educational Use Only.
        </footer>
      </div>
    </>
  );
};

function sentimentDot(sentiment) {
  const base = { width: 12, height: 12, borderRadius: 12, display: 'inline-block' };
  if (sentiment === 'positive') return <span style={{...base, background: '#4ade80'}} />;
  if (sentiment === 'neutral') return <span style={{...base, background: '#f59e0b'}} />;
  return <span style={{...base, background: '#ff6b6b'}} />;
}

const styles = {
  wrapper: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '1.5rem auto',
    color: '#fff',
    background: '#0b1220',
    borderRadius: 12,
    boxShadow: '0 6px 24px rgba(2,6,23,0.6)'
  },
  header: { textAlign: 'left', marginBottom: '1rem' },
  title: { fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#f7fbff', fontWeight: 700 },
  subtitle: { color: '#e6f3ff', opacity: 0.95 },
  filterSection: { margin: '1rem 0 1.25rem' },
  filterRow: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  search: { flex: 1, padding: '0.8rem 1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: '#0c1116', color: '#ffffff' },
  filterButtons: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.6rem 0.9rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#e6f3ff', cursor: 'pointer' },
  activeFilter: { background: 'rgba(255,255,255,0.06)' },
  positiveFilter: { background: 'rgba(74,222,128,0.12)' },
  neutralFilter: { background: 'rgba(245,158,11,0.09)' },
  negativeFilter: { background: 'rgba(255,107,107,0.09)' },
  main: { display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  feed: { flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflow: 'auto' },
  sidebar: { flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#08121a', padding: '1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  newsTitle: { margin: 0, color: '#ffffff', fontSize: '1.05rem' },
  snippet: { color: '#e6f3ff', opacity: 0.95 },
  metaRow: { display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', color: '#9fb0d6', fontSize: '0.9rem' },
  metaDate: {},
  metaCompany: { fontWeight: 600 },
  insightsCard: { background: '#08121a', padding: '1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' },
  insightsTitle: { margin: 0, color: '#ffffff', fontWeight: 600 },
  insightText: { color: '#e6f3ff', margin: '0.5rem 0' },
  pieCard: { background: '#08121a', padding: '1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' },
  pieRow: { display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: '#061117', margin: '0.5rem 0' },
  pieBar: { height: '100%' },
  pieLegend: { display: 'flex', justifyContent: 'space-between', color: '#e6f3ff', fontSize: '0.9rem' },
  linksCard: { display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' },
  link: { color: '#60a5fa', textDecoration: 'none' },
  footer: { marginTop: '1.5rem', color: '#9fb0d6', fontSize: '0.9rem' },
  empty: { padding: '1rem', color: '#d9e8ff' },
  select: {
    flex: 1,
    padding: '0.8rem 1rem',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    background: '#0c1116',
    color: '#ffffff',
    marginRight: '1rem'
  }
};

export default News;
