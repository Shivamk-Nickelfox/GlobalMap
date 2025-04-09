import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Polygon,
  Polyline,
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import { DOMParser as Dom } from "xmldom";
import * as toGeoJSON from "@tmcw/togeojson";
import { FaFolderOpen } from "react-icons/fa";
import { Box, IconButton } from "@mui/material";
import useResponsive from "../Hooks/Responsive";
import { containerBox, iconButtonBase, headerBox } from "../Styles/MapStyling";
import { getGeoData, saveGeoData, clearGeoData } from "../IndexedDB/Db";
import "leaflet/dist/leaflet.css";

const MapUploaderKML = () => {
  const [geoData, setGeoData] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const demoPolygon = [
    [28.9, 76.8],
    [28.9, 77.3],
    [28.4, 77.3],
    [28.4, 76.8],
  ];

  const demoPolyline = [
    [30.7, 78.4],
    [29.9, 78.0],
    [27.6, 80.7],
    [25.4, 83.0],
    [22.6, 88.4],
  ];
  const { isSmallScreen, isTablet, isDesktop } = useResponsive();
  const mapRef = useRef();

  let marginLeftValue;
  if (isSmallScreen) marginLeftValue = "0";
  else if (isTablet) marginLeftValue = "-5px";
  else if (isDesktop) marginLeftValue = "-10px";
  else marginLeftValue = "-7px";
  useEffect(() => {
    const fetchGeoData = async () => {
      const data = await getGeoData();
      if (data) {
        setGeoData(data);
        setFileUploaded(true);
        setTimeout(() => {
          const bounds = L.geoJSON(data).getBounds();
          mapRef.current?.fitBounds(bounds);
        }, 0);
      }
    };

    fetchGeoData();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".kml")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const kmlDom = new Dom().parseFromString(e.target.result, "text/xml");
          const converted = toGeoJSON.kml(kmlDom);
          setGeoData(converted);
          setFileUploaded(true);
          saveGeoData(converted);
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
  const handleClearData = async () => {
    await clearGeoData();
    window.location.reload();
    setFileUploaded(false);
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
      width="100%"
      mt={4}
    >
      <Box sx={headerBox}>Map</Box>
      <Box sx={{ ...containerBox }}>
        {!fileUploaded && (
          <IconButton component="label" sx={iconButtonBase()}>
            <FaFolderOpen size={24} color="#0000FF" />
            <input
              type="file"
              accept=".kml"
              onChange={handleFileUpload}
              hidden
            />
          </IconButton>
        )}

        {fileUploaded && (
          <Box sx={iconButtonBase()}>
            <button
              onClick={handleClearData}
              style={{
                backgroundColor: "#0000FFFF",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              CD
            </button>
          </Box>
        )}

        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "8px",
            zIndex: 0,
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Polygon
            positions={demoPolygon}
            pathOptions={{ color: "green", fillOpacity: 0.4 }}
          />

          <Polyline
            positions={demoPolyline}
            pathOptions={{ color: "blue", weight: 4 }}
          />
          {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapUploaderKML;
