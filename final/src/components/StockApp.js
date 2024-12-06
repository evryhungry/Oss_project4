import React, { useEffect, useState } from "react";
import { getAccessToken, fetchStockData } from "./api";

const StockApp = () => {
  const [accessToken, setAccessToken] = useState("");
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    // AccessToken 발급
    const initialize = async () => {
      const token = await getAccessToken();
      if (token) {
        setAccessToken(token);
        const data = await fetchStockData(token, "005930"); // 삼성전자 종목 코드
        setStockData(data);
      }
    };
    initialize();
  }, []);

  return (
    <div>
      <h1>가상 주식 시장</h1>
      {stockData ? (
        <div>
          <h2>{stockData.stck_nm}</h2>
          <p>현재가: {stockData.stck_prpr}원</p>
          <p>전일 대비: {stockData.prdy_vrss}원</p>
          <p>등락률: {stockData.prdy_ctrt}%</p>
        </div>
      ) : (
        <p>주식 데이터를 가져오는 중...</p>
      )}
    </div>
  );
};

export default StockApp;
