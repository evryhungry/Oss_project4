import React from "react";
import "../css/Portfolio.css";

const Portfolio = ({ portfolio }) => {
  const renderPortfolio = () => {
    if (!portfolio || Object.keys(portfolio).length === 0) {
      return <p>현재 보유한 주식이 없습니다.</p>;
    }

    return Object.entries(portfolio).map(([stock, quantity]) => (
      <div key={stock} className="portfolio-item">
        <h3>{stock}</h3>
        <p>보유량: {quantity}주</p>
      </div>
    ));
  };

  return (
    <div className="portfolio">
      <h2>투자내역</h2>
      <div className="portfolio-list">{renderPortfolio()}</div>
    </div>
  );
};

export default Portfolio;
