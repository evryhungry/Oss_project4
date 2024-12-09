import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "..css/StockChart.css"; // 스타일 파일 연결

const StockChart = ({ data }) => {
  // 날짜와 종가 데이터만 추출
  const chartData = Object.entries(data["Time Series (Daily)"]).map(([date, values]) => ({
    date,
    close: parseFloat(values["4. close"]),
  }));

  return (
    <div className="chart-container">
      <h2>Stock Prices</h2>
      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
