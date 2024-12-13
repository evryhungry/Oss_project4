import React, { useState, useEffect } from "react";
import StockDashboard from "./StockDashboard";
import Portfolio from "./Portfolio";
import "../css/Header.css";
import axios from "axios";

const MOCK_INFO_URL = "https://672818db270bd0b9755452f8.mockapi.io/api/vi/infos";
const MOCK_STOCKS_URL = "https://675082c469dc1669ec1b75a8.mockapi.io/api/stocks";

const Header = () => {
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState({});
  const [mockStocks, setMockStocks] = useState([]);
  const [activeTab, setActiveTab] = useState("거래소");

  // MockAPI에서 포트폴리오 데이터 초기화
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(MOCK_STOCKS_URL);
        const portfolioData = response.data.reduce((acc, stock) => {
          acc[stock.name] = {
            quantity: stock.EA,
            totalSpent: stock.totalSpent || 0,
          };
          return acc;
        }, {});
        setPortfolio(portfolioData);
        setMockStocks(response.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };
    fetchPortfolio();
  }, []);

  const renderContent = () => {
    if (activeTab === "거래소") {
      return (
        <StockDashboard
          balance={balance}
          onUpdateBalance={setBalance}
          portfolio={portfolio}
          onUpdatePortfolio={setPortfolio}
          mockStocks={mockStocks}
        />
      );
    } else if (activeTab === "투자내역") {
      return <Portfolio portfolio={portfolio} mockStocks={mockStocks} />;
    }
  };

  return (
    <div className="header">
      <div className="header-logo">
        <h1>UPstock</h1>
      </div>
      <div className="header-nav">
        <button
          className={`nav-button ${activeTab === "거래소" ? "active" : ""}`}
          onClick={() => setActiveTab("거래소")}
        >
          거래소
        </button>
        <button
          className={`nav-button ${activeTab === "투자내역" ? "active" : ""}`}
          onClick={() => setActiveTab("투자내역")}
        >
          투자내역
        </button>
      </div>
      <div className="header-content">{renderContent()}</div>
    </div>
  );
};

export default Header;
