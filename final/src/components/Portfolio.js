import React, { useState, useEffect } from "react";
import "../css/Portfolio.css";
import axios from "axios";
import TransactionModal from "./TransactionModal";

const MOCK_API_URL = "https://675082c469dc1669ec1b75a8.mockapi.io/api/stocks";

const Portfolio = ({ portfolio }) => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentPrices, setCurrentPrices] = useState({});

  const STOCK_API_KEY = "FRGZ0RQC0BBMDSCV";
  const STOCK_API_URL = "https://www.alphavantage.co/query";

  // 주식별 현재 가격을 불러오는 함수
  const fetchStockPrice = async (symbol) => {
    try {
      const response = await axios.get(
        `${STOCK_API_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${STOCK_API_KEY}`
      );
      const timeSeries = response.data["Time Series (Daily)"];

      if (!timeSeries) {
        console.error("No data found for:", symbol);
        return;
      }

      const latestDate = Object.keys(timeSeries)[0];
      const latestClosePrice = parseFloat(timeSeries[latestDate]["4. close"]);
      setCurrentPrices((prev) => ({ ...prev, [symbol]: latestClosePrice }));
    } catch (error) {
      console.error("Error fetching stock price:", error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(MOCK_API_URL);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();

    // 보유한 모든 주식에 대해 가격을 불러오기
    Object.keys(portfolio).forEach((stock) => {
      fetchStockPrice(stock);
    });
  }, [portfolio]);

  // 주식별로 거래 내역을 합산하는 함수
  const aggregateTransactions = () => {
    const aggregated = {};

    transactions.forEach(({ name, price, EA, type }) => {
      if (!aggregated[name]) {
        aggregated[name] = {
          totalSpent: 0,
          totalQuantity: 0,
          transactions: [],
        };
      }

      if (type === "buy") {
        aggregated[name].totalSpent += price * EA;
        aggregated[name].totalQuantity += EA;
      } else if (type === "sell") {
        aggregated[name].totalSpent -= price * EA;
        aggregated[name].totalQuantity -= EA;
      }

      aggregated[name].transactions.push({ price, EA, type });
    });

    // 보유 수량이 0인 주식 필터링
    return Object.fromEntries(
      Object.entries(aggregated).filter(([_, data]) => data.totalQuantity > 0)
    );
  };

  // 평단가를 계산하는 함수
  const calculateAveragePrice = (transactions) => {
    let totalSpent = 0;
    let totalQuantity = 0;

    transactions.forEach(({ price, EA, type }) => {
      if (type === "buy") {
        totalSpent += price * EA;
        totalQuantity += EA;
      } else if (type === "sell") {
        totalSpent -= price * EA;
        totalQuantity -= EA;
      }
    });

    return totalQuantity > 0 ? totalSpent / totalQuantity : 0;
  };

  const renderPortfolio = () => {
    const aggregated = aggregateTransactions();

    if (Object.keys(aggregated).length === 0) {
      return <p>현재 보유한 주식이 없습니다.</p>;
    }

    return Object.entries(aggregated).map(([stock, { totalSpent, totalQuantity, transactions }]) => {
      const averagePrice = calculateAveragePrice(transactions);
      const currentPrice = currentPrices[stock] || 0;
      const priceChangePercent = currentPrice
        ? ((currentPrice - averagePrice) / averagePrice) * 100
        : 0;

      return (
        <div key={stock} className="portfolio-item">
          <h3 onClick={() => openModal(stock, transactions)}>{stock}</h3>
          <p>보유량: {totalQuantity}주</p>
          <p>평단가: ${averagePrice.toFixed(2)}</p>
          <p>
            현재 가격: ${currentPrice.toFixed(2)} (
            <span style={{ color: priceChangePercent > 0 ? "green" : "red" }}>
              {priceChangePercent > 0 ? "+" : ""}
              {priceChangePercent.toFixed(2)}%
            </span>)
          </p>
        </div>
      );
    });
  };

  const openModal = (stock, transactions) => {
    setSelectedStock({ stock, transactions });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  return (
    <div className="portfolio">
      <h2>투자내역</h2>
      <div className="portfolio-list">{renderPortfolio()}</div>

      {isModalOpen && selectedStock && (
        <TransactionModal
          stock={selectedStock.stock}
          transactions={selectedStock.transactions}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Portfolio;
