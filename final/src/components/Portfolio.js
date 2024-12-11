import React, { useState, useEffect } from "react";
import "../css/Portfolio.css";
import axios from "axios";
import TransactionModal from "./TransactionModal";  // 새로 만든 모달 컴포넌트 임포트

const Portfolio = ({ portfolio }) => {
  // 상태 변수: 거래 내역 저장, 모달 열기/닫기 상태, 선택된 주식 저장
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 열기/닫기 상태
  const [selectedStock, setSelectedStock] = useState(null);  // 선택된 주식
  const [currentPrices, setCurrentPrices] = useState({});  // 주식별 현재 가격 상태

  const STOCK_API_KEY = "DXW4T0AN8RCFEIEA";  // Alpha Vantage API 키
  const STOCK_API_URL = "https://www.alphavantage.co/query";  // Alpha Vantage API URL

  // 주식별 현재 가격을 불러오는 함수
  const fetchStockPrice = async (symbol) => {
    try {
      const response = await axios.get(
        `${STOCK_API_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${STOCK_API_KEY}`
      );
      const timeSeries = response.data["Time Series (Daily)"];
      
      // 데이터가 없거나 유효하지 않으면 로그로 출력
      if (!timeSeries) {
        console.error("No data found for:", symbol);
        return;
      }

      const latestDate = Object.keys(timeSeries)[0];  // 최신 날짜 가져오기
      const latestClosePrice = parseFloat(timeSeries[latestDate]["4. close"]);  // 최신 종가

      // 가격을 currentPrices 상태에 업데이트
      setCurrentPrices((prev) => ({ ...prev, [symbol]: latestClosePrice }));
    } catch (error) {
      console.error("Error fetching stock price:", error);
    }
  };

  // MockAPI에서 거래 내역 데이터를 가져오는 함수
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("https://675082c469dc1669ec1b75a8.mockapi.io/api/stocks");
        setTransactions(response.data);  // 가져온 거래 내역을 상태에 저장
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();  // 컴포넌트가 마운트될 때 데이터 가져오기

    // 보유한 모든 주식에 대해 가격을 불러오기
    Object.keys(portfolio).forEach((stock) => {
      fetchStockPrice(stock);  // 각 주식의 현재 가격 불러오기
    });
  }, [portfolio]);  // portfolio가 변경될 때마다 주식 가격을 다시 불러옴

  // 주식별로 거래 내역을 합산하는 함수
  const aggregateTransactions = () => {
    const aggregated = {};

    // transactions 배열을 순회하며 주식별로 합산
    transactions.forEach(({ name, price, EA, trading_time, type }) => {
      if (!aggregated[name]) {
        aggregated[name] = {
          totalSpent: 0,  // 총 금액
          totalQuantity: 0,  // 총 수량
          transactions: [],  // 거래 내역 저장
        };
      }
      aggregated[name].totalSpent += price * EA;  // 금액 합산
      aggregated[name].totalQuantity += EA;  // 수량 합산
      aggregated[name].transactions.push({ price, EA, trading_time, type });  // 거래 내역 추가
    });

    return aggregated;
  };

  // 포트폴리오 내용을 렌더링하는 함수
  const renderPortfolio = () => {
    const aggregated = aggregateTransactions();  // 주식별 합산된 거래 내역

    if (Object.keys(aggregated).length === 0) {
      return <p>현재 보유한 주식이 없습니다.</p>;  // 보유 주식이 없을 때 메시지
    }

    return Object.entries(aggregated).map(([stock, { totalSpent, totalQuantity, transactions }]) => {
      const averagePrice = totalSpent / totalQuantity;  // 평단가 계산
      const currentPrice = currentPrices[stock] || 0;  // 현재 가격
      const priceChangePercent = currentPrice
        ? ((currentPrice - averagePrice) / averagePrice) * 100  // 가격 변화 비율 계산
        : 0;

      return (
        <div key={stock} className="portfolio-item">
          <h3 onClick={() => openModal(stock, transactions)}>{stock}</h3> {/* 주식 이름 클릭 시 모달 열기 */}
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

  // 모달 열기 함수
  const openModal = (stock, transactions) => {
    setSelectedStock({ stock, transactions });  // 선택된 주식과 거래 내역 저장
    setIsModalOpen(true);  // 모달 열기
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);  // 모달 닫기
    setSelectedStock(null);  // 선택된 주식 초기화
  };

  return (
    <div className="portfolio">
      <h2>투자내역</h2>
      <div className="portfolio-list">{renderPortfolio()}</div> {/* 포트폴리오 목록 렌더링 */}

      {/* 거래 내역 모달 */}
      {isModalOpen && selectedStock && (
        <TransactionModal
          stock={selectedStock.stock}  // 선택된 주식명
          transactions={selectedStock.transactions}  // 선택된 주식의 거래 내역
          onClose={closeModal}  // 모달 닫기 함수
        />
      )}
    </div>
  );
};

export default Portfolio;
