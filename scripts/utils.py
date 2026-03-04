import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib

def load_close_from_csv(path):
    """
    Robust loader for CSVs created by download_data.py.
    - ensures Date exists and is parsed
    - finds Close / Adj Close column
    - coerces Close to numeric, drops non-numeric rows
    """
    df = pd.read_csv(path, dtype=str)  # read everything as string initially
    # try to find date column
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    else:
        # try common variations
        possible_date = [c for c in df.columns if 'date' in c.lower()]
        if possible_date:
            df['Date'] = pd.to_datetime(df[possible_date[0]], errors='coerce')
        else:
            df['Date'] = pd.NaT

    # find Close column
    close_col = None
    for candidate in ['Close', 'close', 'Adj Close', 'Adj_Close', 'AdjClose']:
        if candidate in df.columns:
            close_col = candidate
            break
    if close_col is None:
        # fallback: try last column as close
        close_col = df.columns[-1]

    # coerce to numeric and drop invalid rows
    df['Close'] = pd.to_numeric(df[close_col], errors='coerce')
    # drop rows where Date is NaT or Close is NaN
    df = df.dropna(subset=['Close'])
    if 'Date' in df.columns:
        df = df.dropna(subset=['Date'])
    df = df.sort_values('Date', ascending=True).reset_index(drop=True)

    if df.empty:
        raise ValueError(f"No valid numeric Close values found in CSV: {path}")

    return df[['Date','Close']]

def create_windows(series, window_size=5):
    X, y = [], []
    for i in range(len(series) - window_size):
        X.append(series[i:i+window_size])
        y.append(series[i+window_size])
    return np.array(X), np.array(y)

def scale_series(train_series, test_series):
    scaler = MinMaxScaler(feature_range=(0,1))
    scaler.fit(train_series.reshape(-1,1))
    train_scaled = scaler.transform(train_series.reshape(-1,1)).flatten()
    test_scaled = scaler.transform(test_series.reshape(-1,1)).flatten()
    return scaler, train_scaled, test_scaled

def save_scaler(scaler, path):
    joblib.dump(scaler, path)

def load_scaler(path):
    return joblib.load(path)

def rmse(y_true, y_pred):
    return np.sqrt(np.mean((y_true - y_pred)**2))

def r2_score_sklearn(y_true, y_pred):
    from sklearn.metrics import r2_score
    return r2_score(y_true, y_pred)
