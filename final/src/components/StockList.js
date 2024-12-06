import React from "react";
import StockItem from "./StockItem";

const StockList = ({ stocks, onSelectStock }) => {
  return (
    <div className="stock-list">
      {stocks.map((stock, index) => (
        <StockItem
          key={index}
          stock={stock}
          onClick={() => onSelectStock(stock)} // 종목 클릭 이벤트
        />
      ))}
    </div>
  );
};

export default StockList;
