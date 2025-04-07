// src/styles/mapStyles.js
const containerBox = {
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
  };
  
  const iconButtonBase = (marginLeftValue) => ({
    position: "absolute",
    top: 78,
    left: 16,
    zIndex: 1000,
    ml: marginLeftValue,
    backgroundColor: "white",
    "&:hover": { backgroundColor: "#f0f0f0" },
  });
  
  export { containerBox, iconButtonBase };
  