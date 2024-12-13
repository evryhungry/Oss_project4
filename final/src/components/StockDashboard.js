import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TradeForm from "./TradeForm";
import "../css/StockDashboard.css";
import axios from "axios";

const MOCK_INFO_URL = "https://672818db270bd0b9755452f8.mockapi.io/api/vi/infos";
const MOCK_STOCKS_URL = "https://675082c469dc1669ec1b75a8.mockapi.io/api/stocks";

const StockDashboard = ({ balance, onUpdateBalance, portfolio, onUpdatePortfolio, mockStocks }) => {
  const [selectedStock, setSelectedStock] = useState({ name: "Apple", symbol: "AAPL" });
  const [stocks, setStocks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const STOCK_API_KEY = "DXW4T0AN8RCFEIEA";
  const STOCK_API_URL = "https://www.alphavantage.co/query";

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

  const fetchCompanyInfo = async (name) => {
    try {
      const response = await axios.get(MOCK_INFO_URL);
      const companies = response.data;
      const info = companies.find((company) => company.name === name);
      setCompanyInfo(info);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  const fetchStocks = async () => {
    try {
      const response = await axios.get(MOCK_INFO_URL);
      const filteredStocks = response.data.map((item) => ({
        name: item.name,
        symbol: item.symbol,
      }));
      setStocks(filteredStocks);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    }
  };

  useEffect(() => {
    fetchStockData("AAPL");
    fetchCompanyInfo("Apple");
    fetchStocks();
  }, []);

  const handleStockChange = (stock) => {
    setSelectedStock(stock);
    fetchStockData(stock.symbol);
    fetchCompanyInfo(stock.name);
  };

  const handleTrade = async (type, quantity) => {
    const stockData = mockStocks.find((stock) => stock.name === selectedStock.name);
  
    if (!stockData) {
      alert("유효하지 않은 주식 데이터입니다.");
      return;
    }
  
    const totalPrice = latestPrice * Number(quantity); // latestPrice로 계산
    const totalEA = mockStocks
      .filter((stock) => stock.name === selectedStock.name)
      .reduce((acc, stock) => acc + stock.EA, 0); // totalEA 계산
  
    if (type === "buy" && balance >= totalPrice) {
      // 매수 로직
      try {
        await axios.post(MOCK_STOCKS_URL, {
          name: selectedStock.name,
          price: latestPrice,
          EA: quantity,
          trading_time: new Date().toISOString(),
          type: "buy",
        });
        onUpdatePortfolio((prev) => ({
          ...prev,
          [selectedStock.name]: {
            quantity: (prev[selectedStock.name]?.quantity || 0) + quantity,
            totalSpent: (prev[selectedStock.name]?.totalSpent || 0) + totalPrice,
          },
        }));
        onUpdateBalance(balance - totalPrice);
      } catch (error) {
        console.error("Error updating stock data:", error);
      }
    } else if (type === "sell" && totalEA >= quantity) {
      // 매도 로직
      try {
        await axios.post(MOCK_STOCKS_URL, {
          name: selectedStock.name,
          price: latestPrice,
          EA: -quantity,
          trading_time: new Date().toISOString(),
          type: "sell",
        });
        onUpdatePortfolio((prev) => {
          const current = prev[selectedStock.name];
          return {
            ...prev,
            [selectedStock.name]: {
              quantity: current.quantity - quantity,
              totalSpent: current.totalSpent,
            },
          };
        });
        onUpdateBalance(balance + totalPrice);
      } catch (error) {
        console.error("Error updating stock data:", error);
      }
    } else {
      alert("잔액 부족 또는 매도 가능한 수량이 부족합니다!");
    }
  };
  

  const latestPrice = chartData.length > 0 ? chartData[0].close : 0;


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
            stockInfo={companyInfo}
            mockStocks={mockStocks}
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