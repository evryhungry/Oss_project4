import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TradeForm from "./TradeForm";
import "../css/StockDashboard.css";
import axios from "axios";

const StockDashboard = ({ balance, onUpdateBalance, portfolio, onUpdatePortfolio }) => {
  const [selectedStock, setSelectedStock] = useState({ name: "Apple", symbol: "AAPL" });
  const [chartData, setChartData] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null); // 회사 정보 상태 추가
  const [loading, setLoading] = useState(false);

  const STOCK_API_KEY = "DXW4T0AN8RCFEIEA"; // Alpha Vantage API 키
  const STOCK_API_URL = "https://www.alphavantage.co/query";
  const MOCK_API_URL = "https://672818db270bd0b9755452f8.mockapi.io/api/vi/infos"; // MockAPI URL

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
      const response = await axios.get(MOCK_API_URL);
      const companies = response.data;
      const info = companies.find((company) => company.name === name);
      setCompanyInfo(info);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  useEffect(() => {
    // 초기 데이터 로드 (Apple 데이터 및 정보)
    fetchStockData("AAPL");
    fetchCompanyInfo("Apple");
  }, []);

  const handleStockChange = (stock) => {
    setSelectedStock(stock);
    fetchStockData(stock.symbol);
    fetchCompanyInfo(stock.name);
  };

  const latestPrice = chartData.length > 0 ? chartData[0].close : 0;
  const maxPurchasable = Math.floor(balance / latestPrice);

  const handleTrade = (type, quantity, totalPrice) => {
    if (type === "buy" && balance >= totalPrice) {
      onUpdatePortfolio((prev) => ({
        ...prev,
        [selectedStock.name]: (prev[selectedStock.name] || 0) + quantity,
      }));
      onUpdateBalance(balance - totalPrice);
    } else if (type === "sell" && portfolio[selectedStock.name] >= quantity) {
      onUpdatePortfolio((prev) => ({
        ...prev,
        [selectedStock.name]: prev[selectedStock.name] - quantity,
      }));
      onUpdateBalance(balance + totalPrice);
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
      {/* 왼쪽 컨테이너 */}
      <div className="left-container">
        {/* 차트 */}
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

        {/* TradeForm */}
        <div className="trade-form-container">
          <TradeForm
            stockName={selectedStock.name}
            stockPrice={latestPrice}
            balance={balance}
            portfolio={portfolio}
            onTrade={handleTrade}
          />
          {/* 회사 정보 */}
          {companyInfo && (
            <div className="company-info">
              <h3>회사 정보</h3>
              <p><strong>상장 날짜:</strong> {companyInfo.launchDate}</p>
              <p><strong>총 발행량:</strong> {companyInfo.totalSupply}</p>
              <p><strong>시가총액:</strong> {companyInfo.marketCap}</p>
              <p><strong>웹사이트:</strong> <a href={companyInfo.website} target="_blank" rel="noreferrer">{companyInfo.website}</a></p>
              <p><strong>문의:</strong> {companyInfo.contact}</p>
              <p><strong>자산 설명:</strong> {companyInfo.assetDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 Stock List */}
      <div className="stock-list">
        <h3>Stock List</h3>
        {stocks.map((stock, index) => (
          <button
            key={index}
            className={`stock-button ${
              selectedStock.name === stock.name ? "active" : ""
            }`}
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
