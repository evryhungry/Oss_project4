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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentStockInfo, setCurrentStockInfo] = useState(null);

  const STOCK_API_KEY = "DXW4T0AN8RCFEIEA";
  const STOCK_API_URL = "https://www.alphavantage.co/query";

  const fetchStockData = async (symbol) => {
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

  const handleEdit = (info) => {
    setCurrentStockInfo(info);
    setEditModalOpen(true);
  };

  const handleDelete = (info) => {
    setCurrentStockInfo(info);
    setDeleteModalOpen(true);
  };

  const updateCompanyInfo = async () => {
    try {
      await axios.put(`${MOCK_INFO_URL}/${currentStockInfo.id}`, currentStockInfo);
      alert("정보가 수정되었습니다.");
      setEditModalOpen(false);
      fetchCompanyInfo(currentStockInfo.name);
    } catch (error) {
      console.error("Error updating company info:", error);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${MOCK_INFO_URL}/${currentStockInfo.id}`);
      setCompanyInfo(null);
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting stock info:", error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const latestPrice = chartData.length > 0 ? chartData[0].close : 0;


  return (
    <div className="dashboard">
      <div className="left-container">
        <div className="chart-container">
          <h2>{selectedStock.name} Stock Prices</h2>
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
        </div>
        <div className="trade-form-container">
          <TradeForm
            stockName={selectedStock.name}
            stockPrice={latestPrice}
            balance={balance}
            portfolio={portfolio}
            onTrade={() => {}}
            stockInfo={companyInfo}
            mockStocks={mockStocks}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

        <p className="more-symbols">
          더 많은 심볼을 보고 싶다면 <br />
          <a
            href="https://namu.wiki/w/%ED%8B%B0%EC%BB%A4"
            target="_blank"
            rel="noopener noreferrer"
          >
            이곳으로!
          </a>
        </p>
      </div>
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>정보 수정</h3>
            <form>
              <div>
                <label htmlFor="name">회사 이름:</label>
                <input
                  type="text"
                  id="name"
                  value={currentStockInfo?.name || ""}
                  onChange={(e) => setCurrentStockInfo({ ...currentStockInfo, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="launchDate">설립일:</label>
                <input
                  type="date"
                  id="launchDate"
                  value={currentStockInfo?.launchDate || ""}
                  onChange={(e) => setCurrentStockInfo({ ...currentStockInfo, launchDate: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="totalSupply">총 공급량:</label>
                <input
                  type="number"
                  id="totalSupply"
                  value={currentStockInfo?.totalSupply || ""}
                  onChange={(e) => setCurrentStockInfo({ ...currentStockInfo, totalSupply: e.target.value })}
                />
              </div>
              <button type="button" onClick={updateCompanyInfo}>저장</button>
              <button type="button" onClick={() => setEditModalOpen(false)}>닫기</button>
            </form>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>정말 삭제하시겠습니까?</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                className="delete"
                onClick={confirmDelete}
              >
                삭제
              </button>
              <button
                className="cancel"
                onClick={() => setDeleteModalOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
