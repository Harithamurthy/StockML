const API_URL = 'http://localhost:8000'; // Make sure this matches your FastAPI server port

export const getPrediction = async (ticker) => {
    try {
        const response = await fetch(`${API_URL}/predict/${ticker}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Prediction error:', error);
        throw new Error(error.message || 'Failed to fetch prediction');
    }
};
