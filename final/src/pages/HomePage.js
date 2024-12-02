import React from "react";
import { Link } from "react-router-dom";
import StockComponent from "./StockComponent";

const HomePage = () => {
  return (
    <div>
      <header>
        <h1>가상 주식 시장</h1>
        <nav>
          <Link to="/mypage">마이 페이지</Link>
        </nav>
      </header>
      <main>
        <StockComponent />
      </main>
    </div>
  );
};

export default HomePage;
