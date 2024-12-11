import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TradeForm from "./TradeForm";
import "../css/StockDashboard.css";
import axios from "axios";

const StockDashboard = ({ balance, onUpdateBalance, portfolio, onUpdatePortfolio }) => {
  const [selectedStock, setSelectedStock] = useState({ name: "Apple", symbol: "AAPL" });
  const [chartData, setChartData] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);  // 회사 정보 상태 추가
  const [loading, setLoading] = useState(false);
  const [mockAPIStocks, setMockAPIStocks] = useState([]);

  const STOCK_API_KEY = "DXW4T0AN8RCFEIEA";
  const STOCK_API_URL = "https://www.alphavantage.co/query";
  const MOCK_API_URL = "https://672818db270bd0b9755452f8.mockapi.io/api/vi/infos";

  const fetchStockData = async (symbol) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${STOCK_API_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${STOCK_API_KEY}`
      );
      const timeSeries = response.data["Time Series (Daily)"];
      const formattedData = Object.entries(timeSeries).map(([date, values]) => ({
        date,
        close: parseFloat(values["4. close"]),
      })).reverse();
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMockAPIStocks = async () => {
    try {
      const response = await axios.get(MOCK_API_URL);
      setMockAPIStocks(response.data);
    } catch (error) {
      console.error("Error fetching MockAPI stocks:", error);
    }
  };

  const fetchCompanyInfo = async (name) => {
    try {
      const response = await axios.get(MOCK_API_URL);
      const companies = response.data;
      const info = companies.find((company) => company.name === name);
      setCompanyInfo(info);  // 회사 정보 상태 업데이트
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  useEffect(() => {
    fetchStockData("AAPL");
    fetchCompanyInfo("Apple");
    fetchMockAPIStocks();
  }, []);

  const handleStockChange = (stock) => {
    setSelectedStock(stock);
    fetchStockData(stock.symbol);
    fetchCompanyInfo(stock.name);
  };

  const latestPrice = chartData.length > 0 ? chartData[0].close : 0;
  const maxPurchasable = Math.floor(balance / latestPrice);

  const getAvailableStockQuantity = (stockName) => {
    const stockData = mockAPIStocks.find((stock) => stock.name === stockName);
    return stockData ? stockData.EA : 0;
  };

  const handleTrade = (type, quantity, totalPrice) => {
    const availableQuantity = getAvailableStockQuantity(selectedStock.name);

    if (type === "buy" && balance >= totalPrice) {
      onUpdatePortfolio((prev) => {
        const currentStock = prev[selectedStock.name] || { quantity: 0, totalSpent: 0 };
        const newQuantity = currentStock.quantity + quantity;
        const newTotalSpent = currentStock.totalSpent + totalPrice;

        return {
          ...prev,
          [selectedStock.name]: {
            quantity: newQuantity,
            totalSpent: newTotalSpent,
          },
        };
      });
      onUpdateBalance(balance - totalPrice);
    } else if (type === "sell" && availableQuantity >= quantity) {
      const stockData = mockAPIStocks.find((stock) => stock.name === selectedStock.name);
      if (stockData) {
        axios.put(`${MOCK_API_URL}/${stockData.id}`, {
          ...stockData,
          EA: stockData.EA - quantity,
        }).then(() => {
          onUpdatePortfolio((prev) => {
            const currentStock = prev[selectedStock.name];
            const newQuantity = currentStock.quantity - quantity;
            const newTotalSpent = currentStock.totalSpent;

            return {
              ...prev,
              [selectedStock.name]: {
                quantity: newQuantity,
                totalSpent: newTotalSpent,
              },
            };
          });
          onUpdateBalance(balance + totalPrice);
        }).catch((error) => {
          console.error("Error updating MockAPI stock:", error);
        });
      }
    } else {
      alert("Insufficient balance or stock quantity!");
    }
  };

  const stocks = [
    { name: "Apple", symbol: "AAPL" },
    { name: "IBM", symbol: "IBM" },
  ];

  return (
    <div className="dashboard">
      <div className="left-container">
        <div className="chart-container">
          <h2>{selectedStock.name} Stock Prices</h2>
          {loading ? (
            <p>Loading stock data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[
                    Math.min(...chartData.map((d) => d.close)),
                    Math.max(...chartData.map((d) => d.close)),
                  ]}
                  tickFormatter={(tick) => tick.toFixed(2)}
                />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="trade-form-container">
          <TradeForm
            stockName={selectedStock.name}
            stockPrice={latestPrice}
            balance={balance}
            portfolio={portfolio}
            onTrade={handleTrade}
            stockInfo={companyInfo}  // 회사 정보 전달
          />
        </div>
      </div>

      <div className="stock-list">
        <h3>Stock List</h3>
        {stocks.map((stock, index) => (
          <button
            key={index}
            className={`stock-button ${selectedStock.name === stock.name ? "active" : ""}`}
            onClick={() => handleStockChange(stock)}
          >
            {stock.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockDashboard;
