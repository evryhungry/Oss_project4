import React from "react";

const StockInfo = ({ stock }) => {
  return (
    <div>
      <h2>{stock.name} 정보</h2>
      <p>
        <strong>상장일:</strong> {stock.launchDate}
      </p>
      <p>
        <strong>시가총액:</strong> {stock.marketCap}
      </p>
      <p>
        <strong>현재 가격:</strong> {stock.price.toFixed(2)} KRW
      </p>
    </div>
  );
};

export default StockInfo;
