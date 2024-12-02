import React, { useState, useEffect, useCallback } from "react";
import { useAccessToken } from "../context/AccessTokenContext";

const StockComponent = () => {
  const accessToken = useAccessToken();
  const [stockData, setStockData] = useState([]);
  const stockCodes = ["005930", "000660", "035420"]; // 삼성전자, SK하이닉스, NAVER

  const fetchStockData = useCallback(async () => {
    if (!accessToken) return;

    try {
      const stocks = await Promise.all(
        stockCodes.map(async (code) => {
          // GET 요청에 필요한 데이터를 URL의 쿼리 파라미터로 전달
          const url = `/api/uapi/domestic-stock/v1/quotations/search-stock-inf`;
          
          const response = await fetch(url, {
            method: "GET",
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
              PDNO: code
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch data for code: ${code}`);
          }

          return await response.json();
        })
      );
      setStockData(stocks);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    }
  }, [accessToken, JSON.stringify(stockCodes)]);

  useEffect(() => {
    if (accessToken) {
      fetchStockData();
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
