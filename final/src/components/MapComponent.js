import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 국가 좌표
const countryCoordinates = {
    US: { lat: 38.9072, lng: -77.0369 }, // 미국
    KR: { lat: 37.5665, lng: 126.9780 }, // 한국
    CH: { lat: 46.8182, lng: 8.2275 },   // 스위스
    JP: { lat: 35.6895, lng: 139.6917 }, // 일본
    EU: { lat: 50.8503, lng: 4.3517 },   // 유로존
};

const MapComponent = ({ rates, onSelectCountry }) => {
    return (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            {Object.keys(countryCoordinates).map((countryCode) => {
                const countryRate = rates.find((rate) => rate.ITEM_CODE1 === countryCode);

                return (
                    <Marker
                        key={countryCode}
                        position={countryCoordinates[countryCode]}
                        eventHandlers={{
                            click: () => onSelectCountry(countryRate),
                        }}
                    >
                        <Popup>
                            {countryRate ? (
                                <div>
                                    <strong>{countryRate.ITEM_NAME1}</strong>
                                    <p>금리: {countryRate.DATA_VALUE}%</p>
                                    <p>기간: {countryRate.TIME}</p>
                                </div>
                            ) : (
                                <p>데이터가 없습니다.</p>
                            )}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapComponent;
