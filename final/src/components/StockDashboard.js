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

  const STOCK_API_KEY = "FRGZ0RQC0BBMDSCV";
  const STOCK_API_URL = "https://www.alphavantage.co/query";

  // 주식 데이터를 가져오는 함수
  const fetchStockData = async (symbol) => {
    try {
      const response = await axios.get(
        `${STOCK_API_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${STOCK_API_KEY}`
      );
      const timeSeries = response.data["Time Series (Daily)"];
      const formattedData = Object.entries(timeSeries)
        .map(([date, values]) => ({
          date,
          close: parseFloat(values["4. close"]),
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // 날짜 순 정렬 (오름차순)
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  // 회사 정보를 가져오는 함수
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

  // 주식 목록을 가져오는 함수
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

  // 매수 및 매도 거래 처리 함수
  const handleTrade = (type, stockName, quantity) => {
    console.log("StockDashboard에서 전달된 quantity 값:", quantity); // 디버깅 로그

    // 최신 날짜를 기준으로 가격 가져오기
    const sortedChartData = [...chartData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentPrice = sortedChartData.length > 0 ? sortedChartData[sortedChartData.length - 1].close : 0;

    if (isNaN(quantity) || quantity <= 0) {
      console.error("유효하지 않은 quantity 값:", quantity);
      return;
    }

    const newTransaction = {
      name: stockName,
      price: currentPrice, // 최신 가격으로 설정
      EA: quantity,
      type,
    };

    console.log("최종 newTransaction 객체:", newTransaction); // 디버깅 로그

    axios.post(MOCK_STOCKS_URL, newTransaction)
      .then(() => {
        console.log(`${type === "buy" ? "매수" : "매도"} 거래가 추가되었습니다:`, newTransaction);
        if (type === "buy") {
          onUpdateBalance(balance - currentPrice * quantity);
        } else if (type === "sell") {
          onUpdateBalance(balance + currentPrice * quantity);
        }
      })
      .catch((error) => {
        console.error(`${type === "buy" ? "매수" : "매도"} 거래 추가 실패:`, error);
      });
  };

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
            stockPrice={chartData.length > 0 ? chartData[chartData.length - 1].close : 0}
            balance={balance}
            portfolio={portfolio}
            onTrade={(type, quantity) => handleTrade(type, selectedStock.name, quantity)}
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
      </div>
    </div>
  );
};

export default StockDashboard;
