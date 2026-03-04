import os
import logging
import joblib
import numpy as np
import pandas as pd
import yfinance as yf
from tensorflow.keras.models import load_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.join(os.path.dirname(__file__), '..')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

def get_latest_from_csv(ticker, required=5):
    csv_path = os.path.join(DATA_DIR, f"{ticker}.csv")
    if not os.path.exists(csv_path):
        return None
    try:
        # Read flexibly, avoid forcing dtypes (some CSVs have a stray header-like second row)
        df = pd.read_csv(csv_path, low_memory=False)
        # Normalize Date column
        if 'Date' in df.columns:
            df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        else:
            # try first column as date if named differently
            first_col = df.columns[0]
            df['Date'] = pd.to_datetime(df[first_col], errors='coerce')

        # Find Close column (case-insensitive)
        close_col = None
        for c in df.columns:
            if 'close' in c.lower():
                close_col = c
                break
        if close_col is None:
            # fallback to last numeric column
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            close_col = numeric_cols[-1] if len(numeric_cols) > 0 else df.columns[-1]

        # Coerce Close to numeric and drop invalid rows
        df['Close_clean'] = pd.to_numeric(df[close_col], errors='coerce')
        # Drop rows where Close is NaN or Date is NaT
        df = df.dropna(subset=['Close_clean'])
        if 'Date' in df.columns:
            df = df.dropna(subset=['Date'])
        # Sort by date ascending and return last `required` closes
        df = df.sort_values('Date', ascending=True).reset_index(drop=True)
        closes = df['Close_clean'].values
        if len(closes) >= required:
            return closes[-required:]
        else:
            logger.info(f"CSV for {ticker} has only {len(closes)} valid closes (<{required})")
            return None
    except Exception as e:
        logger.warning(f"Failed to read/clean CSV for {ticker}: {e}")
        return None

def get_latest_from_yf(ticker, days=15, required=5):
    try:
        df = yf.download(ticker, period=f'{days}d', progress=False)
        if df is None or df.empty:
            return None
        closes = df['Close'].dropna().values
        if len(closes) >= required:
            return closes[-required:]
    except Exception as e:
        logger.warning(f"yfinance fetch failed for {ticker}: {e}")
    return None

def get_latest_stock_data(ticker, required=5):
    # Prefer local CSV to avoid network/CORS issues
    closes = get_latest_from_csv(ticker, required=required)
    if closes is not None:
        logger.info(f"Using local CSV for {ticker} ({len(closes)} prices)")
        return closes
    closes = get_latest_from_yf(ticker, days=15, required=required)
    if closes is not None:
        logger.info(f"Using yfinance for {ticker} ({len(closes)} prices)")
        return closes
    raise ValueError(f"Insufficient recent data for {ticker} (need {required} close values)")

def predict_next_day(ticker):
    try:
        ticker = ticker.strip()
        logger.info(f"Starting prediction for {ticker}")

        # model files
        model_files = {
            'scaler': os.path.join(MODELS_DIR, f"{ticker}_scaler.pkl"),
            'lr': os.path.join(MODELS_DIR, f"{ticker}_lr.pkl"),
            'lstm': os.path.join(MODELS_DIR, f"{ticker}_lstm.h5"),
            'metrics': os.path.join(MODELS_DIR, f"{ticker}_metrics.pkl")
        }
        missing = [k for k, p in model_files.items() if not os.path.exists(p)]
        if missing:
            msg = f"Missing model files for {ticker}: {', '.join(missing)}"
            logger.error(msg)
            return {"success": False, "error": msg}

        # load models and scaler
        scaler = joblib.load(model_files['scaler'])
        lr_model = joblib.load(model_files['lr'])
        # load Keras model without compiling to avoid metric deserialization issues
        lstm_model = load_model(model_files['lstm'], compile=False)
        logger.info(f"Keras model loaded for {ticker} (compile=False)")

        metrics = joblib.load(model_files['metrics'])

        # get recent closes (local CSV first)
        recent = get_latest_stock_data(ticker, required=5)
        current_price = float(recent[-1])

        # scale data (scaler expects 2D)
        scaled = scaler.transform(np.array(recent).reshape(-1, 1)).flatten()

        # prepare inputs
        lr_input = scaled.reshape(1, -1)            # shape (1, window)
        lstm_input = scaled.reshape(1, len(scaled), 1)  # shape (1, window, 1)

        # predict
        lr_pred_scaled = lr_model.predict(lr_input)
        lstm_pred_scaled = lstm_model.predict(lstm_input)

        # inverse transform
        lr_price = float(scaler.inverse_transform(np.array(lr_pred_scaled).reshape(-1, 1))[0][0])
        lstm_price = float(scaler.inverse_transform(np.array(lstm_pred_scaled).reshape(-1, 1))[0][0])

        logger.info(f"{ticker} prediction OK: current={current_price}, lr={lr_price}, lstm={lstm_price}")

        return {
            "success": True,
            "current_price": current_price,
            "predicted_lr": lr_price,
            "predicted_lstm": lstm_price,
            "metrics": {
                "lr_r2": metrics.get("lr_r2"),
                "lstm_r2": metrics.get("lstm_r2")
            }
        }

    except Exception as e:
        logger.exception(f"Prediction failed for {ticker}: {e}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    # quick local test (prints a structured result)
    print(predict_next_day("RELIANCE.NS"))
