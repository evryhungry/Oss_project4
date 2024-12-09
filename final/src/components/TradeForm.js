import React, { useState } from "react";
import "../css/TradeForm.css";

const TradeForm = ({ stockName, stockPrice, balance, portfolio, onTrade }) => {
  const [quantity, setQuantity] = useState(""); // 초기값을 빈 문자열로 설정
  const [tradeType, setTradeType] = useState("buy"); // 기본값: 매수

  // 구매 가능 수량과 매도 가능 수량 계산
  const maxPurchasable = Math.floor(balance / stockPrice); // 구매 가능 수량
  const maxSellable = portfolio[stockName] || 0; // 매도 가능 수량

  // 입력값 변경 핸들러
  const handleQuantityChange = (e) => {
    const value = e.target.value;

    // 숫자만 허용
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

    setQuantity(""); // 입력 초기화
  };

  return (
    <div className="trade-form">
      {/* 전환 헤더 */}
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

      {/* 현재 정보와 입력 영역을 가로로 배치 */}
      <div className="trade-content">
        {/* 현재 정보 */}
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

        {/* 입력 및 버튼 */}
        <div className="trade-input">
          <div className="form-group">
            <label htmlFor="quantity" />
            <input
              type="text" // 텍스트 입력으로 변경
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
                !quantity || // 수량이 입력되지 않았을 경우
                Number(quantity) < 1 || // 수량이 1보다 작을 경우
                (tradeType === "buy" && Number(quantity) > maxPurchasable) || // 구매 가능 수량 초과
                (tradeType === "sell" && Number(quantity) > maxSellable) // 매도 가능 수량 초과
              }
            >
              {tradeType === "buy" ? "구매" : "판매"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeForm;
