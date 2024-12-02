import React, { createContext, useContext, useEffect, useState } from "react";

const AccessTokenContext = createContext();

export const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch("/api/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: "/oauth2/tokenP",
          method: "POST",
          body: {
            grant_type: "client_credentials",
          },
        }),
      });
      const data = await response.json();
      setAccessToken(data.access_token);
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
