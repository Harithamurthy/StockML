from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from scripts.predict import predict_next_day
from scripts.market_data import get_top_movers
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000", "http://127.0.0.1:5173"],  # Update to your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/predict/{ticker}")
async def get_prediction(ticker: str):
    try:
        result = predict_next_day(ticker)
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {
            "ticker": ticker,
            "current_price": result["current_price"],
            "prediction": {
                "linear_regression": result["predicted_lr"],
                "lstm": result["predicted_lstm"]
            },
            "accuracy": {
                "lr_r2": result["metrics"]["lr_r2"],
                "lstm_r2": result["metrics"]["lstm_r2"]
            }
        }
    except Exception as e:
        logger.error(f"API Error for {ticker}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market/top-movers")
async def get_market_movers():
    try:
        data = get_top_movers()
        if data is None:
            raise HTTPException(status_code=500, detail="Failed to fetch market data")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"status": "API is running", "version": "1.0"}
