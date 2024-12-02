import React, { createContext, useContext, useEffect, useState } from "react";

const AccessTokenContext = createContext();

export const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log("Fetching access token...");
        const response = await fetch("/api/oauth2/tokenP", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            grant_type: "client_credentials",
            appkey: process.env.REACT_APP_KIS_KEY,
            appsecret: process.env.REACT_APP_KIS_SECRET,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch access token. Status: " + response.status);
        }

        const data = await response.json();
        console.log("Access token fetched successfully:", data.access_token);
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchToken();
    const interval = setInterval(fetchToken, 30 * 60 * 1000); // 30분마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <AccessTokenContext.Provider value={accessToken}>
      {children}
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => {
  return useContext(AccessTokenContext);
};
