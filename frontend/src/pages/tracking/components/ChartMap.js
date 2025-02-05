import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { FaCarSide } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const ChartMap = ({ data: sensorData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!sensorData || sensorData.length === 0) {
      console.error("No sensor data available.");
      return;
    }

    setData(sensorData);

    // Tính toán tọa độ trung bình
    const latitudes = sensorData.map(point => point.latitude);
    const longitudes = sensorData.map(point => point.longitude);
 
    const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
 
    const container = L.DomUtil.get("map");
    if (container != null) {
       container._leaflet_id = null;
    }
 
    const map = L.map("map").setView([avgLatitude, avgLongitude], 12); // Sử dụng tọa độ trung bình
 
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:"pk.eyJ1IjoidGFyLWhlbCIsImEiOiJjbDJnYWRieGMwMTlrM2luenIzMzZwbGJ2In0.RQRMAJqClc4qoNwROT8Umg",
    }).addTo(map);

    L.Marker.prototype.options.icon = DefaultIcon;

    const start = data.length > 0 ? data[0] : null;
    const end = data.length > 0 ? data[data.length - 1] : null;

    if (start) {
      L.marker([start.latitude, start.longitude])
        .addTo(map)
        .bindPopup(`<b>Temperature:</b> ${start.temperature}°C<br><b>Humidity:</b> ${start.humidity}%<br><b>Time:</b> ${new Date(start.timestamp).toLocaleString()}`);
    }

    if (end) {
      L.marker([end.latitude, end.longitude])
        .addTo(map)
        .bindPopup(`<b>Temperature:</b> ${end.temperature}°C<br><b>Humidity:</b> ${end.humidity}%<br><b>Time:</b> ${new Date(end.timestamp).toLocaleString()}`);
    }

    const carIcon = L.divIcon({
      className: "leaflet-car-icon",
      html: ReactDOMServer.renderToString(<FaCarSide size={32} color="red" />), // Render FaCar icon thành HTML
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    if (start) {
      const carMarker = L.marker([start.latitude, start.longitude], { icon: carIcon }).addTo(map);
      let currentIndex = 0;

      const moveCar = () => {
        if (currentIndex < data.length) {
          const point = data[currentIndex];
          carMarker.setLatLng([point.latitude, point.longitude]);
          currentIndex++;
        } else {
          clearInterval(moveInterval);
        }
      };
      const moveInterval = setInterval(moveCar, 1000);
    }

    const latLngs = data.map(point => [point.latitude, point.longitude]);
    L.polyline(latLngs, { color: "blue" }).addTo(map);

  }, [data, sensorData]);

  return (
    <div style={{ margin: "30px" }}>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default ChartMap;