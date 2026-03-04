import os
import sys
import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

# ensure local scripts directory is importable when running `python scripts/train_models.py`
SCRIPT_DIR = os.path.dirname(__file__)
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from utils import load_close_from_csv, create_windows, scale_series, save_scaler, rmse, r2_score_sklearn

BASE_DIR = os.path.join(os.path.dirname(__file__), '..')
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
RESULTS_DIR = os.path.join(BASE_DIR, 'results')
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

TICKERS = [
    'RELIANCE.NS','TCS.NS','INFY.NS','ICICIBANK.NS','HDFCBANK.NS',
    'BAJFINANCE.NS','WIPRO.NS','TATAMOTORS.NS','TECHM.NS','AXISBANK.NS'
]

WINDOW = 5
TEST_RATIO = 0.2

def build_lstm(input_shape):
    model = Sequential()
    model.add(LSTM(50, input_shape=input_shape, return_sequences=False))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')
    return model

def train_for_ticker(ticker):
    csv_path = os.path.join(DATA_DIR, f"{ticker}.csv")
    if not os.path.exists(csv_path):
        print(f"No data for {ticker}, skipping.")
        return
    try:
        df = load_close_from_csv(csv_path)
    except Exception as e:
        print(f"Failed to load CSV for {ticker}: {e}. Skipping.")
        return

    # Ensure Close values are numeric and drop any remaining invalid rows
    closes_series = pd.to_numeric(df['Close'], errors='coerce').dropna()
    if closes_series.empty:
        print(f"No numeric Close values for {ticker} after cleaning. Sample rows:")
        print(df.head(5).to_dict(orient='list'))
        print("Skipping ticker.")
        return

    closes = closes_series.values.astype(float)
    if len(closes) < WINDOW + 10:
        print(f"Not enough data for {ticker} ({len(closes)} rows), skipping.")
        return

    n = len(closes)
    split_idx = int(n * (1 - TEST_RATIO))
    train_series = closes[:split_idx]
    test_series = closes[split_idx - WINDOW:]  # include window overlap for X creation

    scaler, train_scaled, test_scaled = scale_series(train_series, test_series)
    save_scaler(scaler, os.path.join(MODELS_DIR, f"{ticker}_scaler.pkl"))

    X_train, y_train = create_windows(train_scaled, WINDOW)
    X_test, y_test = create_windows(test_scaled, WINDOW)

    if len(X_train) == 0 or len(X_test) == 0:
        print(f"Insufficient windows for {ticker}, skipping.")
        return

    # Linear Regression
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    joblib.dump(lr, os.path.join(MODELS_DIR, f"{ticker}_lr.pkl"))

    lr_pred_scaled = lr.predict(X_test)
    lr_pred = scaler.inverse_transform(lr_pred_scaled.reshape(-1,1)).flatten()
    lr_true = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()
    lr_rmse = rmse(lr_true, lr_pred)
    lr_r2 = r2_score_sklearn(lr_true, lr_pred)

    # LSTM
    X_train_lstm = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_test_lstm = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))
    lstm = build_lstm((X_train_lstm.shape[1], X_train_lstm.shape[2]))
    es = EarlyStopping(monitor='loss', patience=5, restore_best_weights=True)
    lstm.fit(X_train_lstm, y_train, epochs=50, batch_size=16, verbose=0, callbacks=[es])
    lstm_path = os.path.join(MODELS_DIR, f"{ticker}_lstm.h5")
    lstm.save(lstm_path)

    lstm_pred_scaled = lstm.predict(X_test_lstm).flatten()
    lstm_pred = scaler.inverse_transform(lstm_pred_scaled.reshape(-1,1)).flatten()
    lstm_rmse = rmse(lr_true, lstm_pred)  # compare to same true values
    lstm_r2 = r2_score_sklearn(lr_true, lstm_pred)

    # Save results CSV
    results_df = pd.DataFrame({
        'actual': lr_true,
        'pred_lr': lr_pred,
        'pred_lstm': lstm_pred
    })
    results_df.to_csv(os.path.join(RESULTS_DIR, f"{ticker}_results.csv"), index=False)

    # Save metrics
    metrics = {
        'lr_rmse': float(lr_rmse), 'lr_r2': float(lr_r2),
        'lstm_rmse': float(lstm_rmse), 'lstm_r2': float(lstm_r2)
    }
    joblib.dump(metrics, os.path.join(MODELS_DIR, f"{ticker}_metrics.pkl"))

    print(f"Trained {ticker}: LR RMSE={lr_rmse:.4f} R2={lr_r2:.4f} | LSTM RMSE={lstm_rmse:.4f} R2={lstm_r2:.4f}")
    print(f"Saved models and results for {ticker}")

if __name__ == "__main__":
    for t in TICKERS:
        train_for_ticker(t)
