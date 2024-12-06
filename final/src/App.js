import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import './App.css';

const API_ENDPOINT = "https://672818db270bd0b9755452f8.mockapi.io/api/vi/stock";

// 주식 리스트 컴포넌트
const StockList = ({ stocks }) => (
  <div className="stock-list">
    <h2>주식 리스트</h2>
    <ul>
      {stocks.map((stock) => (
        <li key={stock.id}>
          <Link to={`/stock/${stock.id}`}>
            <div>
              <strong>{stock.name}</strong>
              <p>현재가: {stock.price} KRW</p>
              <p>전일 대비: +2.5%</p>
              <p>거래량: 1,000,000</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// 주식 상세 정보 컴포넌트
const StockDetail = ({ stocks }) => {
  const { id } = useParams();
  const stock = stocks.find((stock) => stock.id === parseInt(id));

  if (!stock) return <p>주식을 찾을 수 없습니다.</p>;

  return (
    <div className="stock-detail">
      <h2>{stock.name} 상세 정보</h2>
      <p><strong>상장일:</strong> {stock.launchDate}</p>
      <p><strong>총 공급량:</strong> {stock.totalSupply}</p>
      <p><strong>시가총액:</strong> {stock.marketCap}</p>
      <p><strong>웹사이트:</strong> <a href={stock.website} target="_blank" rel="noopener noreferrer">{stock.website}</a></p>
      <p><strong>기술적 특징:</strong> {stock.technicalFeatures}</p>
      <p><strong>자산 설명:</strong> {stock.assetDescription}</p>
    </div>
  );
};

// 메인 App 컴포넌트
const App = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    // MockAPI에서 데이터 가져오기
    const fetchStocks = async () => {
      try {
        const response = await fetch(API_ENDPOINT); // fetch 사용
        const data = await response.json(); // JSON 파싱
        setStocks(data); // 상태 업데이트
      } catch (error) {
        console.error("Error fetching stocks:", error); // 에러 처리
      }
    };

    fetchStocks();
  }, []);

  return (
    <Router>
      <div className="App">
        <header>
          <h1>UPstock</h1>
          <nav>
            <Link to="/">홈</Link>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={<StockList stocks={stocks} />}
          />
          <Route
            path="/stock/:id"
            element={<StockDetail stocks={stocks} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
