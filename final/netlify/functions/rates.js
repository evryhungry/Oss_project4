const axios = require("axios");

const API_BASE_URL = "https://openapi.koreainvestment.com:9443";
const APP_KEY = process.env.REACT_APP_KIS_KEY;
const APP_SECRET = process.env.REACT_APP_KIS_SECRET;

exports.handler = async (event) => {
  try {
    console.log("Event received:", event); // Lambda로 전달된 이벤트 확인
    const { path, method } = JSON.parse(event.body || "{}");
    console.log(`Request path: ${path}`);
    console.log(`Method: ${method}`);

    let response;
    if (method === "POST") {
      console.log("Making POST request to:", `${API_BASE_URL}${path}`);
      response = await axios.post(`${API_BASE_URL}${path}`, {
        grant_type: "client_credentials",
        appkey: APP_KEY,
        appsecret: APP_SECRET,
      }, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    } else {
      throw new Error("Only POST requests are supported.");
    }

    console.log("Response from API:", response.data);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error occurred:", error.message);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
