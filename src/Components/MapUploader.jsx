import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import { DOMParser as Dom } from "xmldom";
import * as toGeoJSON from "@tmcw/togeojson";
import { FaFolderOpen } from "react-icons/fa";
import { Box, IconButton } from "@mui/material";
import useResponsive from "../Hooks/Responsive";
import { containerBox, iconButtonBase } from "../Styles/MapStyling";
import "leaflet/dist/leaflet.css";

const ResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
};

const MapUploaderKML = () => {
  const [geoData, setGeoData] = useState(null);
  const { isSmallScreen, isTablet, isDesktop } = useResponsive();

  let marginLeftValue;
  if (isSmallScreen) marginLeftValue = "0";
  else if (isTablet) marginLeftValue = "-5px";
  else if (isDesktop) marginLeftValue = "-10px";
  else marginLeftValue = "-7px";

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".kml")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const kmlDom = new Dom().parseFromString(e.target.result, "text/xml");
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      mt={4}
    >
      <Box sx={containerBox}>
        <IconButton component="label" sx={iconButtonBase(marginLeftValue)}>
          <FaFolderOpen size={24} color="#0000FF" />
          <input type="file" accept=".kml" onChange={handleFileUpload} hidden />
        </IconButton>

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
          <ResizeHandler />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {geoData && <GeoJSON data={geoData} />}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapUploaderKML;
