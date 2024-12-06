import React, { useState, useEffect } from 'react';

const StockSimulator = () => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
  const symbol = 'IBM';

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );
        setStockData(response.data['Time Series (Daily)']);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };
    fetchStockData();
  }, []);

  if (loading) return <p>Loading stock data...</p>;

  return (
    <div>
      <h1>{symbol} Stock Data</h1>
      <ul>
        {stockData &&
          Object.entries(stockData).map(([date, data]) => (
            <li key={date}>
              {date}: Open: {data['1. open']} Close: {data['4. close']}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StockSimulator;
