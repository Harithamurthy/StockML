import os

def check_environment():
    # Check models directory
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    if not os.path.exists(models_dir):
        print("Error: models/ directory not found!")
        return False

    # List expected model files for each stock
    stocks = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'ICICIBANK.NS', 'HDFCBANK.NS',
              'BAJFINANCE.NS', 'WIPRO.NS', 'TATAMOTORS.NS', 'TECHM.NS', 'AXISBANK.NS']
    
    expected_files = []
    for stock in stocks:
        expected_files.extend([
            f"{stock}_lr.pkl",
            f"{stock}_lstm.h5",
            f"{stock}_scaler.pkl",
            f"{stock}_metrics.pkl"
        ])

    # Check each file
    missing_files = []
    existing_files = []
    for file in expected_files:
        file_path = os.path.join(models_dir, file)
        if not os.path.exists(file_path):
            missing_files.append(file)
        else:
            existing_files.append(file)

    print("\n=== Models Directory Check ===")
    print(f"Directory: {models_dir}")
    print(f"\nFound {len(existing_files)} model files:")
    for f in existing_files:
        print(f"✓ {f}")
    
    if missing_files:
        print(f"\nMissing {len(missing_files)} files:")
        for f in missing_files:
            print(f"✗ {f}")
    
    # Check data directory and CSV files
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    print("\n=== Data Directory Check ===")
    print(f"Directory: {data_dir}")
    
    if os.path.exists(data_dir):
        csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
        print(f"\nFound {len(csv_files)} CSV files:")
        for f in csv_files:
            print(f"✓ {f}")
    else:
        print("Error: data/ directory not found!")

if __name__ == "__main__":
    check_environment()
    print("\nTo fix any missing files:")
    print("1. Run 'python scripts/download_data.py' to get CSV files")
    print("2. Run 'python scripts/train_models.py' to generate model files")
