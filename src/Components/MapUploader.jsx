// MapUploaderKML.jsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useState } from "react";
import { DOMParser as Dom } from "xmldom";
import * as toGeoJSON from "@tmcw/togeojson"; // ✅ correct

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
      <h2 className="text-xl font-semibold mb-2">Upload a KML file</h2>
      <input
        type="file"
        accept=".kml"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {/* Wrapper for centering */}
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
            width: "800px", // or 100% if you want full width
          }}
        >
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
