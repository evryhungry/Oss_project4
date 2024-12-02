import React from 'react';

const InfoPanel = ({ selectedCountry }) => {
    if (!selectedCountry) {
        return <div>국가를 선택하세요.</div>;
    }

    return (
        <div className="info-panel">
            <h2>선택된 국가 정보</h2>
            <p>
                <strong>국가:</strong> {selectedCountry.ITEM_NAME1}
            </p>
            <p>
                <strong>금리:</strong> {selectedCountry.DATA_VALUE}%
            </p>
            <p>
                <strong>기간:</strong> {selectedCountry.TIME}
            </p>
        </div>
    );
};

export default InfoPanel;
