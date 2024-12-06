import React from "react";

const StockItem = ({ stock, onClick }) => {
  return (
    <div className="stock-item" onClick={onClick}>
      <p>{stock.name}: {stock.price.toFixed(2)}원</p>
    </div>
  );
};

export default StockItem;
