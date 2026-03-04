const API_URL = 'http://localhost:8000';

export const getTopMovers = async () => {
    try {
        const response = await fetch(`${API_URL}/market/top-movers`);
        if (!response.ok) {
            throw new Error('Failed to fetch market data');
        }
        return await response.json();
    } catch (error) {
        console.error('Market data error:', error);
        throw error;
    }
};
