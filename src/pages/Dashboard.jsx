import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getTopMovers } from '../services/marketService';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function SmallArrow({ up }) {
  return (
    <span className={`arrow-icon ${up ? "arrow-up" : "arrow-down"}`}>
      {up ? "↑" : "↓"}
    </span>
  );
}

export default function Dashboard() {
  const [marketData, setMarketData] = useState({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchMarketData = async () => {
      try {
        const data = await getTopMovers();
        if (!mounted) return;
        setMarketData({
          gainers: (data.gainers || []).slice(0, 12),
          losers: (data.losers || []).slice(0, 12),
        });
        setLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        if (!mounted) return;
        setError("Unable to load market movers");
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatChange = (c) => {
    const n = Number(c) || 0;
    const sign = n > 0 ? "+" : "";
    return `${sign}${n.toFixed(2)}%`;
  };

  const filterList = (list) =>
    list.filter(
      (s) =>
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        (s.name || "").toLowerCase().includes(query.toLowerCase())
    );

  const showChart = (symbol, history) => {
    setSelectedChart({ symbol, data: history });
  };

  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(to bottom, #171b21, #10141c 70%, #090c10 100%);
          color: #ececec;
          font-family: 'Segoe UI', 'Arial', sans-serif;
        }
        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 16px;
        }
        .dashboard-header {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }
        @media (min-width: 600px) {
          .dashboard-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        .dashboard-title {
          font-size: 2.1rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .dashboard-subtitle {
          font-size: 1rem;
          color: #99aabb;
        }
        .dashboard-search {
          display: flex;
          gap: 14px;
        }
        .input-search {
          width: 210px;
          padding: 8px 11px;
          background: #16181c;
          border: 1px solid #222630;
          border-radius: 7px;
          font-size: 1rem;
          color: #ebeef3;
          outline: none;
        }
        .input-search:focus {
          border-color: #4974e5;
          background: #232634;
        }
        .btn-refresh {
          padding: 8px 13px;
          background: #212738;
          border: 1px solid #232634;
          border-radius: 7px;
          color: #dae6f7;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-refresh:hover,
        .btn-refresh:focus {
          background: #253157;
          border-color: #4563a6;
        }
        .market-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 31px;
        }
        @media (min-width: 600px) {
          .market-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .market-card {
          background: linear-gradient(120deg, #1c2233 70%, #171a24);
          border: 1px solid #282e44;
          border-radius: 16px;
          padding: 23px 24px 14px;
          box-shadow: 0 2px 16px rgba(40,50,80,0.08);
        }
        .gainers-card {
          box-shadow: 0 2px 20px rgba(22, 180, 101, 0.08);
        }
        .losers-card {
          box-shadow: 0 2px 20px rgba(211, 75, 75, 0.09);
        }
        .market-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .market-card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .market-card-updated {
          font-size: 0.98em;
          color: #849abf;
        }
        .market-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 7px;
          border-radius: 8px;
          transition: background 0.14s;
          cursor: pointer;
        }
        .gainers-row:hover {
          background: rgba(22, 180, 101, 0.06);
        }
        .losers-row:hover {
          background: rgba(211, 75, 75, 0.07);
        }
        .market-symbol {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .market-symbol-box {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #59b88d;
          color: #10141c;
          border-radius: 9px;
          font-size: 0.94rem;
          font-weight: 700;
        }
        .losers-row .market-symbol-box {
          background: #e87b7b;
        }
        .market-symbol-name {
          font-size: 0.91em;
          color: #abb5c7;
          margin-top: 2px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .market-stats {
          display: flex;
          align-items: flex-end;
          gap: 18px;
          font-size: 0.98em;
        }
        .market-change {
          font-size: 0.92em;
          margin-top: 2px;
        }
        .gainers-row .market-change {
          color: #54e3ae;
        }
        .losers-row .market-change {
          color: #f2a2a2;
        }
        .market-row-empty {
          padding: 12px 5px;
          color: #788192;
          font-size: 0.96em;
        }
        .loading-spinner {
          margin: 30px auto;
          width: 30px;
          height: 30px;
          border: 4px solid #2a3d5c;
          border-top: 4px solid #567af1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .market-error {
          color: #e87b7b;
          padding: 10px;
          font-size: 1em;
        }
        .arrow-icon {
          width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.08em;
          border-radius: 50%;
          background: #54e3ae;
          color: #181a1f;
        }
        .arrow-down {
          background: #e87b7b;
        }
        .dashboard-footer {
          margin-top: 34px;
          text-align: center;
          font-size: 0.96em;
          color: #6f93a8;
        }
        .chart-container {
          margin-top: 20px;
          padding: 20px;
          background: #1c2233;
          border-radius: 12px;
          border: 1px solid #282e44;
        }
        .chart-title {
          color: #a3e635;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        @media (max-width: 500px) {
          .dashboard-main {
            padding: 16px 3px;
          }
          .market-symbol-box {
            width: 25px;
            height: 25px;
            font-size: 0.75rem;
          }
          .dashboard-title {
            font-size: 1.3rem;
          }
          .market-row {
            gap: 5px;
            padding: 7px 2px;
          }
        }
      `}</style>
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Top Movers</h1>
            <p className="dashboard-subtitle">
              symbols, price and % change for quick scanning.
            </p>
          </div>

          <div className="dashboard-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search symbol or company"
              className="input-search"
            />
            <button className="btn-refresh" onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </div>

        <div className="market-grid">
          {/* Gainers */}
          <div className="market-card gainers-card">
            <div className="market-card-header">
              <div className="market-card-title">
                <SmallArrow up />
                <div>
                  <div>Top Gainers</div>
                  <div>Rising today</div>
                </div>
              </div>
              <div className="market-card-updated">Updated</div>
            </div>

            {loading ? (
              <div className="loading-spinner"></div>
            ) : error ? (
              <div className="market-error">{error}</div>
            ) : (
              <div>
                {filterList(marketData.gainers).length === 0 && (
                  <div className="market-row-empty">No results.</div>
                )}

                {filterList(marketData.gainers).map((s) => (
                  <div
                    key={s.symbol}
                    className="market-row gainers-row"
                    onClick={() => showChart(s.symbol, s.history)}
                  >
                    <div className="market-symbol">
                      <div className="market-symbol-box">{s.symbol.slice(0, 3)}</div>
                      <div>
                        <div>{s.symbol}</div>
                        {s.name && <div className="market-symbol-name">{s.name}</div>}
                      </div>
                    </div>

                    <div className="market-stats">
                      <div>
                        <div>₹{Number(s.price).toFixed(2)}</div>
                        <div className="market-change">{formatChange(s.change)}</div>
                      </div>
                      <div>
                        Vol <span>{s.volume ?? "—"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Losers */}
          <div className="market-card losers-card">
            <div className="market-card-header">
              <div className="market-card-title">
                <SmallArrow up={false} />
                <div>
                  <div>Top Losers</div>
                  <div>Falling today</div>
                </div>
              </div>
              <div className="market-card-updated">Updated</div>
            </div>

            {loading ? (
              <div className="loading-spinner"></div>
            ) : error ? (
              <div className="market-error">{error}</div>
            ) : (
              <div>
                {filterList(marketData.losers).length === 0 && (
                  <div className="market-row-empty">No results.</div>
                )}

                {filterList(marketData.losers).map((s) => (
                  <div
                    key={s.symbol}
                    className="market-row losers-row"
                    onClick={() => showChart(s.symbol, s.history)}
                  >
                    <div className="market-symbol">
                      <div className="market-symbol-box">{s.symbol.slice(0, 3)}</div>
                      <div>
                        <div>{s.symbol}</div>
                        {s.name && <div className="market-symbol-name">{s.name}</div>}
                      </div>
                    </div>

                    <div className="market-stats">
                      <div>
                        <div>₹{Number(s.price).toFixed(2)}</div>
                        <div className="market-change">{formatChange(s.change)}</div>
                      </div>
                      <div>
                        Vol <span>{s.volume ?? "—"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedChart && (
          <div className="chart-container">
            <h3 className="chart-title">{selectedChart.symbol} Price History</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={selectedChart.data}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#334155" />
                <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="dashboard-footer">
         
        </div>
      </main>
    </div>
  );
}
