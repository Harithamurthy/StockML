import axios from 'axios';

const API_KEY = 'D3CJJOEAUOTC8YKN';
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchNews = async () => {
  try {
    // Try different search combinations
    const responses = await Promise.all([
      // Search for NIFTY news
      axios.get(`${BASE_URL}?function=NEWS_SENTIMENT&apikey=${API_KEY}&topics=nifty,sensex`),
      // Search for specific Indian companies
      axios.get(`${BASE_URL}?function=NEWS_SENTIMENT&apikey=${API_KEY}&tickers=TCS.BSE,RELIANCE.BSE,HDFCBANK.BSE`),
    ]);

    let allNews = [];
    
    responses.forEach(response => {
      if (response.data && response.data.feed) {
        allNews = [...allNews, ...response.data.feed];
      }
    });

    if (allNews.length === 0) {
      console.log('No news found, using fallback data');
      return getFallbackNews(); // Use fallback data if API fails
    }

    // Process and return the news
    return allNews
      .map(item => ({
        id: item.url,
        title: item.title,
        snippet: item.summary,
        date: new Date(item.time_published).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata'
        }),
        company: getCompanyName(item),
        sentiment: getSentiment(item.overall_sentiment_score),
        url: item.url
      }))
      .slice(0, 30); // Limit to 30 items

  } catch (error) {
    console.error('API Error:', error);
    return getFallbackNews(); // Use fallback data on error
  }
};

function getCompanyName(item) {
  if (!item.ticker_sentiment || item.ticker_sentiment.length === 0) {
    return 'Indian Market';
  }
  const ticker = item.ticker_sentiment[0].ticker;
  const companies = {
    'TCS.BSE': 'Tata Consultancy Services',
    'RELIANCE.BSE': 'Reliance Industries',
    'HDFCBANK.BSE': 'HDFC Bank',
    // Add more mappings as needed
  };
  return companies[ticker] || ticker.replace('.BSE', '');
}

function getSentiment(score) {
  if (!score) return 'neutral';
  const numScore = parseFloat(score);
  if (numScore > 0.25) return 'positive';
  if (numScore < -0.25) return 'negative';
  return 'neutral';
}

function getFallbackNews() {
  // Fallback news data in case API fails
  return [
    {
      id: '1',
      title: 'Nifty, Sensex rise on global cues; IT stocks lead',
      snippet: 'Indian markets opened higher following positive trends in global equities. IT and banking stocks led the gains.',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      company: 'Indian Market',
      sentiment: 'positive'
    },
    {
      id: '2',
      title: 'TCS Reports Strong Q4 Results',
      snippet: 'Tata Consultancy Services reported better-than-expected quarterly results, driven by strong digital transformation deals.',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      company: 'Tata Consultancy Services',
      sentiment: 'positive'
    },
    {
      id: '3',
      title: 'Reliance Industries Expands Retail Presence',
      snippet: 'Reliance Retail announces expansion plans across tier 2 and 3 cities, aims to add 1000+ stores this year.',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      company: 'Reliance Industries',
      sentiment: 'positive'
    }
  ];
}
