import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 추가적으로 MyPage 등 다른 경로를 정의할 수 있습니다 */}
      </Routes>
    </Router>
  );
};

export default App;
