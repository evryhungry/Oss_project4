import React, { useState } from "react";
import "../css/TradeForm.css";

const TradeForm = ({ stockName, stockPrice, balance, portfolio, onTrade, stockInfo, mockStocks, onEdit, onDelete }) => {
  const [quantity, setQuantity] = useState("");
  const [tradeType, setTradeType] = useState("buy");

  const stockData = mockStocks.filter((stock) => stock.name === stockName);
  const totalEA = stockData.reduce((acc, stock) => acc + stock.EA, 0);
  const maxSellable = totalEA;

  const handleTrade = () => {
    const totalPrice = stockPrice * Number(quantity);
    onTrade(tradeType, Number(quantity), totalPrice);
    setQuantity("");
  };

  return (
    <div className="trade-form">
      <div className="trade-header">
        <button
          className={`trade-tab buy ${tradeType === "buy" ? "active" : ""}`}
          onClick={() => setTradeType("buy")}
        >
          매수
        </button>
        <button
          className={`trade-tab sell ${tradeType === "sell" ? "active" : ""}`}
          onClick={() => setTradeType("sell")}
        >
          매도
        </button>
      </div>
      <div className="trade-info">
        {tradeType === "buy" && (
          <>
            <p>현재 보유 금액: ${balance.toFixed(2)}</p>
            <p>구매 가능 수량: {Math.floor(balance / stockPrice)}주</p>
          </>
        )}
        {tradeType === "sell" && (
          <>
            <p>매도 가능 수량: {maxSellable}주</p>
          </>
        )}
      </div>
      <div className="trade-input">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="수량 입력"
        />
        <button
          className={tradeType === "buy" ? "buy-button" : "sell-button"}
          onClick={handleTrade}
          disabled={
            !quantity ||
            Number(quantity) <= 0 ||
            (tradeType === "buy" && stockPrice * quantity > balance) ||
            (tradeType === "sell" && quantity > maxSellable)
          }
        >
          {tradeType === "buy" ? "구매" : "판매"}
        </button>
      </div>
      {stockInfo && (
        <div className="company-info">
          <div className="company-header">
            <h3>{stockInfo.name} 회사 정보</h3>
            <div className="company-actions">
              <button className="edit-button" onClick={() => onEdit(stockInfo)}>수정</button>
              <button className="delete-button" onClick={() => onDelete(stockInfo)}>삭제</button>
            </div>
          </div>
          <div className="company-details">
            <div>
              <p><strong>설립일:</strong> {stockInfo.launchDate}</p>
              <p><strong>총 공급량:</strong> {stockInfo.totalSupply}</p>
            </div>
            <div>
              <p><strong>시가 총액:</strong> {stockInfo.marketCap}</p>
              <p><strong>웹사이트:</strong> <a href={stockInfo.website} target="_blank" rel="noopener noreferrer">{stockInfo.website}</a></p>
            </div>
          </div>
          <div className="company-description">
            <p><strong>정보:</strong> {stockInfo.assetDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeForm;
