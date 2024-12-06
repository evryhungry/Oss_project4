import React from "react";
import { Link } from "react-router-dom";

const MyPage = ({ balance, investment, stocks }) => {
  const calculateTotalValue = () => {
    return stocks.reduce((total, stock) => total + stock.price * stock.quantity, 0);
  };

  const calculateTotalProfitLoss = () => {
    return stocks.reduce((total, stock) => total + stock.price * stock.quantity - stock.invested, 0);
  };

  const ownedStocks = stocks.filter((stock) => stock.quantity > 0);

  return (
    <div className="card">
      <h2>마이페이지</h2>
      <p>잔고: <strong>{balance.toFixed(2)}원</strong></p>
      <p>총 투자 금액: <strong>{investment.toFixed(2)}원</strong></p>
      <p>현재 총 자산 가치: <strong>{calculateTotalValue().toFixed(2)}원</strong></p>
      <p>
        총 손익:{" "}
        <span style={{ color: calculateTotalProfitLoss() >= 0 ? "green" : "red" }}>
          <strong>{calculateTotalProfitLoss().toFixed(2)}원</strong>
        </span>
      </p>

      <h3>보유 주식 목록</h3>
      {ownedStocks.length > 0 ? (
        <ul>
          {ownedStocks.map((stock) => (
            <li key={stock.id}>
              <Link to={`/stock/${stock.id}`}>
                {stock.name}
              </Link> - 보유량: {stock.quantity}, 투자 금액: {stock.invested.toFixed(2)}원,
              현재 가치: {(stock.price * stock.quantity).toFixed(2)}원,
              손익: <span style={{ color: stock.price * stock.quantity - stock.invested >= 0 ? "green" : "red" }}>
                {(stock.price * stock.quantity - stock.invested).toFixed(2)}원
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>보유한 주식이 없습니다.</p>
      )}

      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
};

export default MyPage;
