import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [latestRates, setLatestRates] = useState([]);
    //local
    // const PROXY_URL = 'http://localhost:5000/api/rates';
    //배포
    const PROXY_URL = '/api/rates';

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get(PROXY_URL);
                const rawData = response.data.StatisticSearch.row;
                const latestData = getLatestRates(rawData);
                setLatestRates(latestData);
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
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
            countryRecords.sort((a, b) => parseInt(b.TIME) - parseInt(a.TIME));
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
            <div>
                {latestRates.map((rate) => (
                    <div key={rate.countryCode}>
                        <h2>{rate.countryName} ({rate.countryCode})</h2>
                        <p>최신 금리: {rate.latestRate}%</p>
                        <p>기간: {rate.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
