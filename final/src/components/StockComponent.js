import React, { useState, useEffect, useCallback } from "react";
import { useAccessToken } from "../context/AccessTokenContext";

const stockCodes = ["005930", "000660", "035420"]; // 컴포넌트 외부로 이동하여 변경이 없는 값으로 유지

const StockComponent = () => {
  const accessToken = useAccessToken();
  const [stockData, setStockData] = useState([]);

  const fetchStockData = useCallback(async () => {
    if (!accessToken) {
      console.log("No access token available, skipping fetchStockData.");
      return;
    }

    try {
      console.log("Fetching stock data with access token:", accessToken);
      const stocks = await Promise.all(
        stockCodes.map(async (code) => {
          const response = await fetch("/api/rates", {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Authorization: `Bearer ${accessToken}`,
              appkey: process.env.REACT_APP_KIS_KEY,
              appsecret: process.env.REACT_APP_KIS_SECRET,
              tr_id: "CTPF1604R",
              custtype: "P",
            },
            body: JSON.stringify({
              PRDT_TYPE_CD: "300",
              PDNO: code,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data for code: ${code}. Status: ${response.status}`);
          }

          const stockData = await response.json();
          console.log(`Data for stock code ${code}:`, stockData);
          return stockData;
        })
      );
      console.log("All stock data fetched successfully:", stocks);
      setStockData(stocks);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    }
  }, [accessToken]); // stockCodes를 의존성에서 제거

  useEffect(() => {
    if (accessToken) {
      console.log("Access token available, fetching stock data...");
      fetchStockData();
    } else {
      console.log("No access token yet, waiting...");
    }
  }, [accessToken, fetchStockData]);

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
