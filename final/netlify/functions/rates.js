const axios = require("axios");

const API_BASE_URL = "https://openapi.koreainvestment.com:9443";
const APP_KEY = process.env.REACT_APP_KIS_KEY;
const APP_SECRET = process.env.REACT_APP_KIS_SECRET;

exports.handler = async (event) => {
  try {
    const { path, method, body } = JSON.parse(event.body);

    let response;
    if (method === "POST") {
      response = await axios.post(`${API_BASE_URL}${path}`, body, {
        
      });
    } else if (method === "GET") {
      response = await axios.get(`${API_BASE_URL}${path}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          appkey: APP_KEY,
          appsecret: APP_SECRET,
          Authorization: `Bearer ${body.accessToken}`,
          tr_id: body.tr_id,
          custtype: body.custtype,
        },
        params: body.params,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
