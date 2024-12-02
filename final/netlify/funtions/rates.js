const axios = require('axios');

exports.handler = async function (event, context) {
    const API_KEY =  REACT_APP_KIS_ACCESS; // 한국은행 API 키
    const API_URL = `https://ecos.bok.or.kr/api/StatisticSearch/${API_KEY}/json/kr/1/104/902Y006/M/202403/202406`;

    try {
        const response = await axios.get(API_URL);
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from API' }),
        };
    }
};
