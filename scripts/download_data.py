import os
from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd

TICKERS = [
    'RELIANCE.NS','TCS.NS','INFY.NS','ICICIBANK.NS','HDFCBANK.NS',
    'BAJFINANCE.NS','WIPRO.NS','TATAMOTORS.NS','TECHM.NS','AXISBANK.NS'
]

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(OUT_DIR, exist_ok=True)

def download_all(period_days=730):
    end = datetime.today()
    start = end - timedelta(days=period_days)
    for ticker in TICKERS:
        print(f"Downloading {ticker} from {start.date()} to {end.date()}...")
        try:
            df = yf.download(ticker, start=start.strftime('%Y-%m-%d'), end=end.strftime('%Y-%m-%d'), progress=False)
            if df.empty:
                print(f"Warning: no data for {ticker}")
                continue
            df = df.reset_index()[['Date','Open','High','Low','Close','Volume']]
            out_path = os.path.join(OUT_DIR, f"{ticker}.csv")
            df.to_csv(out_path, index=False)
            print(f"Saved {out_path} ({len(df)} rows)")
        except Exception as e:
            print(f"Failed to download {ticker}: {e}")

if __name__ == "__main__":
    download_all()
