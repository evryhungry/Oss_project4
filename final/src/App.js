import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AccessTokenProvider } from "./context/AccessTokenContext";

const App = () => {
  return (
    <AccessTokenProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* 다른 경로 추가 가능 */}
        </Routes>
      </Router>
    </AccessTokenProvider>
  );
};

export default App;
