import React from "react";
import { useParams, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const StockDetail = ({ stocks }) => {
  const { id } = useParams();
  const stock = stocks.find((s) => s.id === parseInt(id));

  if (!stock) {
    return (
      <div className="card">
        <h2>주식을 찾을 수 없습니다.</h2>
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>{stock.name} 상세 정보</h2>
      <p>현재 가격: <strong>{stock.price.toFixed(2)}원</strong></p>
      <p>보유량: <strong>{stock.quantity}</strong></p>
      <p>투자 금액: <strong>{stock.invested.toFixed(2)}원</strong></p>
      <p>현재 가치: <strong>{(stock.price * stock.quantity).toFixed(2)}원</strong></p>
      <p>
        손익:{" "}
        <span style={{ color: stock.price * stock.quantity - stock.invested >= 0 ? "green" : "red" }}>
          <strong>{(stock.price * stock.quantity - stock.invested).toFixed(2)}원</strong>
        </span>
      </p>

      <div className="chart-container">
        <h3>가격 변동 그래프</h3>
        {stock.priceHistory.length > 0 ? (
          <LineChart width={600} height={300} data={stock.priceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        ) : (
          <p>가격 변동 기록이 없습니다.</p>
        )}
      </div>

      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
};

export default StockDetail;
