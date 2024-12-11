import React, { useState } from "react";
import StockDashboard from "./StockDashboard"; // 주식 대시보드 컴포넌트
import Portfolio from "./Portfolio"; // 포트폴리오 컴포넌트
import "../css/Header.css"; // 스타일 파일

const Header = () => {
  // 상태 변수 설정: 초기 금액 10000으로 설정
  const [balance, setBalance] = useState(10000); 

  // 상태 변수 설정: 초기 포트폴리오는 Apple과 IBM 주식 수량 0으로 설정
  const [portfolio, setPortfolio] = useState({ Apple: 0, IBM: 0 });

  // 상태 변수 설정: 기본적으로 '거래소' 탭이 활성화된 상태로 설정
  const [activeTab, setActiveTab] = useState("거래소");

  // 탭에 따라 내용을 렌더링하는 함수
  const renderContent = () => {
    if (activeTab === "거래소") {
      // '거래소' 탭일 때 주식 대시보드를 렌더링
      return (
        <StockDashboard
          balance={balance} // balance와 portfolio 상태를 전달
          onUpdateBalance={setBalance} // balance를 업데이트할 함수 전달
          portfolio={portfolio} // portfolio 상태를 전달
          onUpdatePortfolio={setPortfolio} // portfolio를 업데이트할 함수 전달
        />
      );
    } else if (activeTab === "투자내역") {
      // '투자내역' 탭일 때 포트폴리오 정보를 렌더링
      return <Portfolio portfolio={portfolio} />;
    }
  };

  return (
    <div className="header">
      <div className="header-logo">
        <h1>UPstock</h1> {/* 웹사이트 로고 */}
      </div>
      <div className="header-nav">
        {/* 거래소 탭 버튼 */}
        <button
          className={`nav-button ${activeTab === "거래소" ? "active" : ""}`}
          onClick={() => setActiveTab("거래소")} // 버튼 클릭 시 '거래소' 탭 활성화
        >
          거래소
        </button>
        {/* 투자내역 탭 버튼 */}
        <button
          className={`nav-button ${activeTab === "투자내역" ? "active" : ""}`}
          onClick={() => setActiveTab("투자내역")} // 버튼 클릭 시 '투자내역' 탭 활성화
        >
          투자내역
        </button>
      </div>
      <div className="header-content">
        {renderContent()} {/* 현재 활성화된 탭에 맞는 내용을 렌더링 */}
      </div>
    </div>
  );
};

export default Header; // Header 컴포넌트 내보내기
