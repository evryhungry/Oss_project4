import React, { useState } from "react";
import StockDashboard from "./StockDashboard";
import Portfolio from "./Portfolio";
import "../css/Header.css";

const Header = () => {
  const [balance, setBalance] = useState(10000); // 초기 금액 설정
  const [portfolio, setPortfolio] = useState({ Apple: 0, IBM: 0 });
  const [activeTab, setActiveTab] = useState("거래소");

  const renderContent = () => {
    if (activeTab === "거래소") {
      return (
        <StockDashboard
          balance={balance}
          onUpdateBalance={setBalance}
          portfolio={portfolio}
          onUpdatePortfolio={setPortfolio}
        />
      );
    } else if (activeTab === "투자내역") {
      return <Portfolio portfolio={portfolio} />;
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
