// MapUploaderKML.jsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useState } from "react";
import { DOMParser as Dom } from "xmldom";
import * as toGeoJSON from "@tmcw/togeojson";
import { FaFolderOpen } from "react-icons/fa";

import "leaflet/dist/leaflet.css";

const MapUploaderKML = () => {
  const [geoData, setGeoData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".kml")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const kmlText = e.target.result;
          const kmlDom = new Dom().parseFromString(kmlText, "text/xml");
          const converted = toGeoJSON.kml(kmlDom);
          setGeoData(converted);
        } catch (err) {
          alert("Failed to convert KML to GeoJSON.");
          console.error(err);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid KML file.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{
            height: "500px",
            width: "800px",
          }}
        >
          <label
            style={{
              zIndex: 1000,
              position: "absolute",
              top: 75,
              left: 10,
              cursor: "pointer",
              marginLeft: "5px",
            }}
          >
            <FaFolderOpen size={30} color="#333" />
            <input
              type="file"
              accept=".kml"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapUploaderKML;
