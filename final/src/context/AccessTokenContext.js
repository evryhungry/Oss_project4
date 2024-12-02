import React, { createContext, useContext, useEffect, useState } from "react";

const AccessTokenContext = createContext();

const fetchAccessToken = async () => {
  try {
    const response = await fetch("https://openapi.koreainvestment.com:9443/oauth2/tokenP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: "YOUR_APP_KEY",
        appsecret: "YOUR_APP_SECRET",
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to fetch access token:", error);
    return null;
  }
};

