import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useState } from "react";
import { DOMParser as Dom } from "xmldom";
import * as toGeoJSON from "@tmcw/togeojson";
import { FaFolderOpen } from "react-icons/fa";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMap } from "react-leaflet";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";

const MapUploaderKML = () => {
  const [geoData, setGeoData] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  let marginLeftValue;

  if (isSmallScreen) {
    marginLeftValue = "0";
  } else if (isTablet) {
    marginLeftValue = "-5px";
  } else if (isDesktop) {
    marginLeftValue = "-10px";
  } else {
    marginLeftValue = "-7px";
  }
  const ResizeHandler = () => {
    const map = useMap();

    useEffect(() => {
      const handleResize = () => {
        map.invalidateSize();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [map]);

    return null;
  };

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      mt={4}
      position="relative"
    >
      <Box
        sx={{
          width: {
            xs: "95vw",
            sm: "90vw",
            md: "80vw",
            lg: "70vw",
          },
          height: {
            xs: "70vh",
            sm: "80vh",
            md: "85vh",
            lg: "90vh",
          },
          position: "relative",
        }}
      >
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            top: 78,
            left: 16,
            zIndex: 1000,
            ml: marginLeftValue,
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
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
