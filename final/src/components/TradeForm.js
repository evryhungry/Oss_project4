import React, { useState } from "react";
import "../css/TradeForm.css";

const TradeForm = ({ stockName, stockPrice, balance, portfolio, onTrade, stockInfo }) => {
  const [quantity, setQuantity] = useState("");
  const [tradeType, setTradeType] = useState("buy");

  const maxPurchasable = Math.floor(balance / stockPrice);
  const maxSellable = portfolio[stockName]?.quantity || 0;

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 0) {
      setQuantity(value);
    }
  };

  const handleTrade = () => {
    const totalPrice = stockPrice * Number(quantity);
    if (tradeType === "buy") {
      onTrade("buy", Number(quantity), totalPrice);
    } else if (tradeType === "sell") {
      onTrade("sell", Number(quantity), totalPrice);
    }
    setQuantity("");
  };

  return (
    <div className="trade-form">
      <div className="trade-header">
        <button
          className={`trade-tab ${tradeType === "buy" ? "active" : ""}`}
          onClick={() => setTradeType("buy")}
        >
          매수
        </button>
        <button
          className={`trade-tab ${tradeType === "sell" ? "active" : ""}`}
          onClick={() => setTradeType("sell")}
        >
          매도
        </button>
      </div>

      <div className="trade-content">
        <div className="trade-info">
          {tradeType === "buy" && (
            <>
              <p>현재 보유 금액: ${balance.toFixed(2)}</p>
              <p>구매 가능 수량: {maxPurchasable}주</p>
            </>
          )}
          {tradeType === "sell" && (
            <>
              <p>현재 보유 금액: ${balance.toFixed(2)}</p>
              <p>매도 가능 수량: {maxSellable}주</p>
            </>
          )}
        </div>

        <div className="trade-input">
          <div className="form-group">
            <label htmlFor="quantity" />
            <input
              type="text"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="수량 입력"
            />
          </div>
          <div className="form-actions">
            <button
              onClick={handleTrade}
              className={tradeType === "buy" ? "buy-button" : "sell-button"}
              disabled={
                !quantity ||
                Number(quantity) < 1 ||
                (tradeType === "buy" && Number(quantity) > maxPurchasable) ||
                (tradeType === "sell" && Number(quantity) > maxSellable)
              }
            >
              {tradeType === "buy" ? "구매" : "판매"}
            </button>
          </div>
        </div>
      </div>

      {/* 회사 정보 표시 */}
      {stockInfo && (
        <div className="company-info">
          <h3>{stockInfo.name} 회사 정보</h3>
          <p><strong>설립일:</strong> {stockInfo.launchDate}</p>
          <p><strong>총 공급량:</strong> {stockInfo.totalSupply}</p>
          <p><strong>시가 총액:</strong> {stockInfo.marketCap}</p>
          <p><strong>웹사이트:</strong> <a href={stockInfo.website} target="_blank" rel="noopener noreferrer">{stockInfo.website}</a></p>
          <p><strong>기술적 특징:</strong> {stockInfo.technicalFeatures}</p>
          <p><strong>자산 설명:</strong> {stockInfo.assetDescription}</p>
        </div>
      )}
    </div>
  );
};

export default TradeForm;
