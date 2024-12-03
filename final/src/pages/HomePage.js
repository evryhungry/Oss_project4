import React, { useState, useEffect } from "react";
import axios from "axios";
import MapComponent from "../components/MapComponent";
import InfoPanel from "../components/InfoPanel";

const HomePage = () => {
  const [latestRates, setLatestRates] = useState([]); // 최신 금리 데이터
  const [selectedCountry, setSelectedCountry] = useState(null); // 선택된 국가
  const PROXY_URL = "/api/rates"; // 배포 환경의 API URL

  // 데이터 호출
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(PROXY_URL);
        const rawData = response.data.StatisticSearch.row;
        const latestData = getLatestRates(rawData);
        setLatestRates(latestData);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchRates();
  }, []);

  // 최신 데이터 필터링 함수
  const getLatestRates = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const country = item.ITEM_CODE1;
      if (!acc[country]) acc[country] = [];
      acc[country].push(item);
      return acc;
    }, {});

    const latestRates = Object.keys(groupedData).map((countryCode) => {
      const countryRecords = groupedData[countryCode];
      countryRecords.sort((a, b) => parseInt(b.TIME) - parseInt(a.TIME)); // 최신 데이터 기준 정렬
      return {
        countryCode,
        countryName: countryRecords[0].ITEM_NAME1,
        latestRate: parseFloat(countryRecords[0].DATA_VALUE),
        time: countryRecords[0].TIME,
      };
    });

    return latestRates;
  };

  return (
    <div>
      <h1>국제 주요국 최신 정책금리</h1>
      {/* MapComponent와 InfoPanel 연결 */}
      <MapComponent rates={latestRates} onSelectCountry={setSelectedCountry} />
      <InfoPanel selectedCountry={selectedCountry} />
    </div>
  );
};

export default HomePage;
