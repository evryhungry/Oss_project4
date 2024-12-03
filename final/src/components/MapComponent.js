import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: 'https://example.com/your-icon.png', // 여기에 원하는 이미지 URL 입력
  iconSize: [32, 32], // 아이콘 크기 설정
  iconAnchor: [16, 32], // 아이콘 기준점 (하단 중앙)
  popupAnchor: [0, -32], // 팝업 위치
});

// 국가 좌표
const countryCoordinates = {
  AU: { lat: -25.2744, lng: 133.7751 }, // 호주
  BR: { lat: -14.235, lng: -51.9253 },  // 브라질
  CA: { lat: 56.1304, lng: -106.3468 }, // 캐나다
  CH: { lat: 46.8182, lng: 8.2275 },    // 스위스
  CL: { lat: -35.6751, lng: -71.543 },  // 칠레
  CN: { lat: 35.8617, lng: 104.1954 },  // 중국
  CZ: { lat: 49.8175, lng: 15.473 },    // 체코
  DK: { lat: 56.2639, lng: 9.5018 },    // 덴마크
  GB: { lat: 51.5074, lng: -0.1278 },   // 영국
  HU: { lat: 47.1625, lng: 19.5033 },   // 헝가리
  ID: { lat: -0.7893, lng: 113.9213 },  // 인도네시아
  IL: { lat: 31.0461, lng: 34.8516 },   // 이스라엘
  IN: { lat: 20.5937, lng: 78.9629 },   // 인도
  IS: { lat: 64.9631, lng: -19.0208 },  // 아이슬란드
  JP: { lat: 35.6895, lng: 139.6917 },  // 일본
  KR: { lat: 37.5665, lng: 126.9780 },  // 한국
  MX: { lat: 23.6345, lng: -102.5528 }, // 멕시코
  NO: { lat: 60.472, lng: 8.4689 },     // 노르웨이
  NZ: { lat: -40.9006, lng: 174.886 },  // 뉴질랜드
  PL: { lat: 51.9194, lng: 19.1451 },   // 폴란드
  RU: { lat: 61.524, lng: 105.3188 },   // 러시아
  SE: { lat: 60.1282, lng: 18.6435 },   // 스웨덴
  TR: { lat: 38.9637, lng: 35.2433 },   // 튀르키예
  US: { lat: 38.9072, lng: -77.0369 },  // 미국
  XM: { lat: 50.8503, lng: 4.3517 },    // 유로 지역
  ZA: { lat: -30.5595, lng: 22.9375 },  // 남아프리카공화국
};

const MapComponent = ({ rates, onSelectCountry }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {rates.map((rate) => {
        const { countryCode, countryName, latestRate, time } = rate;
        const position = countryCoordinates[countryCode];

        if (!position) return null; // 좌표가 없는 국가 스킵

        return (
          <Marker
            key={countryCode}
            position={position}
            eventHandlers={{
              click: () => onSelectCountry(rate),
            }}
          >
            <Popup>
              <div>
                <strong>{countryName} ({countryCode})</strong>
                <p>금리: {latestRate}%</p>
                <p>기간: {time}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
