import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "api.predict_api:app",
        host="127.0.0.1",
        port=8000,
        # Keep reload off on Windows to avoid multiprocessing/reloader crashes
        # that can surface as intermittent 500 errors during prediction.
        reload=False,
        log_level="info"
    )
