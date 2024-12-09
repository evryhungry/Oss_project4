import React, { useState } from "react";
import Header from "../src/components/Header.js";

const App = () => {
  const [balance, setBalance] = useState(1000000); // 초기 잔고
  const [portfolio, setPortfolio] = useState({}); // 초기 보유 주식

  return (
    <div>
      <Header
        balance={balance}
        onUpdateBalance={setBalance}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
      />
    </div>
  );
};

export default App;
