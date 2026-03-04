import axios from "axios";
import NodeCache from "node-cache";

// Allowed tickers and mapping to company names
export const TICKER_MAP = {
  "RELIANCE.NS": "Reliance Industries",
  "TCS.NS": "Tata Consultancy Services",
  "INFY.NS": "Infosys",
  "ICICIBANK.NS": "ICICI Bank",
  "HDFCBANK.NS": "HDFC Bank",
  "BAJFINANCE.NS": "Bajaj Finance",
  "WIPRO.NS": "Wipro",
  "TATAMOTORS.NS": "Tata Motors",
  "TECHM.NS": "Tech Mahindra",
  "AXISBANK.NS": "Axis Bank",
};

const ALLOWED_TICKERS = Object.keys(TICKER_MAP);

// 5 minute cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

function normalizeTickersParam(raw) {
  if (!raw) return ALLOWED_TICKERS.slice();
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  // Deduplicate and preserve only allowed
  const normalized = Array.from(new Set(parts));
  return normalized;
}

function buildCompanyQuery(tickers) {
  // build OR joined company names
  const names = tickers.map((t) => TICKER_MAP[t]).filter(Boolean);
  // If none resolved, fall back to all names
  const q = names.length ? names.join(" OR ") : Object.values(TICKER_MAP).join(" OR ");
  return q;
}

export async function getNews(req, res) {
  try {
    const rawTickers = req.query.tickers || "";
    const requested = normalizeTickersParam(rawTickers);

    // Validate: any ticker not in allowed -> 400
    const invalid = requested.filter((t) => !ALLOWED_TICKERS.includes(t));
    if (invalid.length > 0) {
      return res.status(400).json({ error: `Unsupported tickers: ${invalid.join(", ")}` });
    }

    // Use a stable cache key (sorted requested tickers)
    const keyTickers = requested.length ? requested.slice().sort().join(",") : ALLOWED_TICKERS.join(",");
    const cacheKey = `news:${keyTickers}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ source: "cache", articles: cached });
    }

    const companyQuery = buildCompanyQuery(requested.length ? requested : ALLOWED_TICKERS);

    // eslint-disable-next-line no-undef
    const NEWS_API_KEY = process.env.NEWSAPI_KEY;
    if (!NEWS_API_KEY) {
      return res.status(500).json({ error: "Missing NEWSAPI_KEY in environment" });
    }

    // NewsAPI everything endpoint
    const q = encodeURIComponent(companyQuery);
    const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=50`;

    const resp = await axios.get(url, {
      headers: {
        Authorization: NEWS_API_KEY,
      },
    });

    const items = (resp.data && resp.data.articles) || [];

    // Filter and normalize: only articles that mention one of the company names or tickers
    const normalized = items.map((a) => {
      const title = a.title || "";
      const description = a.description || "";
      const hay = (title + "\n" + description + "\n" + (a.content || "")).toLowerCase();

      const matchedTickers = [];
      for (const t of ALLOWED_TICKERS) {
        const name = (TICKER_MAP[t] || "").toLowerCase();
        const tickerLower = t.toLowerCase();
        // match by company name or ticker token
        if (name && hay.includes(name)) {
          matchedTickers.push(t);
          continue;
        }
        if (tickerLower && hay.includes(tickerLower)) {
          matchedTickers.push(t);
        }
      }

      return {
        raw: a,
        title: title || "",
        description: description || "",
        url: a.url || "",
        source: (a.source && a.source.name) || "",
        publishedAt: a.publishedAt || null,
        urlToImage: a.urlToImage || null,
        matchedTickers,
      };
    }).filter((n) => n.matchedTickers && n.matchedTickers.length > 0);

    // Deduplicate by URL and keep most recent per URL
    const seen = new Map();
    for (const art of normalized) {
      if (!art.url) continue;
      const prev = seen.get(art.url);
      if (!prev) seen.set(art.url, art);
      else {
        // keep the latest publishedAt
        if (new Date(art.publishedAt) > new Date(prev.publishedAt)) seen.set(art.url, art);
      }
    }

    const finalArticles = Array.from(seen.values()).map((a) => {
      return {
        title: a.title,
        description: a.description,
        url: a.url,
        source: a.source,
        publishedAt: a.publishedAt,
        urlToImage: a.urlToImage,
        matchedTickers: a.matchedTickers,
      };
    });

    // cache
    cache.set(cacheKey, finalArticles);

    return res.json({ source: "api", articles: finalArticles });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err && err.response ? err.response.data || err.response.statusText : err);
    return res.status(500).json({ error: "Failed to fetch news" });
  }
}
