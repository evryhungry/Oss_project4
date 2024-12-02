import React, { useState, useEffect } from "react";
import { useAccessToken } from "../context/AccessTokenContext";

const StockComponent = () => {
  const accessToken = useAccessToken();
  const [stockData, setStockData] = useState([]);
  const stockCodes = ["005930", "000660", "035420"]; // 삼성전자, SK하이닉스, NAVER

  const fetchStockData = async () => {
    const stocks = await Promise.all(
      stockCodes.map(async (code) => {
        const response = await fetch("/.netlify/functions/rates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "/uapi/domestic-stock/v1/quotations/search-stock-inf",
            method: "GET",
            body: {
              accessToken,
              params: { PRDT_TYPE_CD: "300", PDNO: code },
            },
          }),
        });
        return await response.json();
      })
    );
    setStockData(stocks);
  };

  useEffect(() => {
    if (accessToken) {
      fetchStockData();
    }
  }, [accessToken]);

  return (
    <div>
      <h1>주식 정보</h1>
      {stockData.length > 0 ? (
        <ul>
          {stockData.map((stock, index) => (
            <li key={index}>
              종목 이름: {stock.stck_nm}, 현재가: {stock.stck_prpr}원
            </li>
          ))}
        </ul>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default StockComponent;
