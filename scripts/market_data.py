import os
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta

TICKERS = [
    'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'ICICIBANK.NS', 'HDFCBANK.NS',
    'BAJFINANCE.NS', 'WIPRO.NS', 'TATAMOTORS.NS', 'TECHM.NS', 'AXISBANK.NS'
]

def get_top_movers():
    try:
        all_changes = []
        
        for ticker in TICKERS:
            try:
                # Get today's data
                stock = yf.Ticker(ticker)
                hist = stock.history(period='2d')
                
                if len(hist) >= 2:
                    prev_close = hist['Close'].iloc[-2]
                    current_price = hist['Close'].iloc[-1]
                    change = ((current_price - prev_close) / prev_close) * 100
                    
                    all_changes.append({
                        'symbol': ticker.replace('.NS', ''),
                        'price': round(current_price, 2),
                        'change': round(change, 2),
                        'prev_close': round(prev_close, 2)
                    })
            except Exception as e:
                print(f"Error fetching {ticker}: {e}")
                continue
        
        # Sort by change percentage
        all_changes.sort(key=lambda x: x['change'], reverse=True)
        
        # Get top 3 gainers and losers
        gainers = all_changes[:3]
        losers = all_changes[-3:][::-1]
        
        return {
            'gainers': gainers,
            'losers': losers,
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    except Exception as e:
        print(f"Error in get_top_movers: {e}")
        return None
