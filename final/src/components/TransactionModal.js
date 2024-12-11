import React from "react";
import "../css/TransactionModal.css";  // 스타일링을 위한 CSS 파일 (선택 사항)

const TransactionModal = ({ stock, transactions, onClose }) => {
  return (
    <div className="transaction-modal">
      <div className="modal-content">
        {/* 모달 헤더: 주식명과 거래 내역 제목 */}
        <h2>{stock} 거래 내역</h2>
        
        {/* 거래 내역을 순회하며 각 거래를 표시 */}
        {transactions.map(({ price, EA, trading_time, type }, index) => (
          <div key={index} className="transaction-item">
            {/* 거래 정보 표시: 거래 타입, 가격, 수량, 거래 시간 */}
            <p>{type} - 가격: ${price}, 수량: {EA}, 거래 시간: {trading_time}</p>
          </div>
        ))}
        
        {/* 닫기 버튼: 모달을 닫기 위한 클릭 이벤트 */}
        <button onClick={onClose} className="close-btn">닫기</button>
      </div>
    </div>
  );
};

export default TransactionModal;
