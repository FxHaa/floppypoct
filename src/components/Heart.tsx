import React from "react";
import heart from "/heart.png";
const Heart = () => (
    <div
        style={{
          display: "inline-block",
          width: "60px", // Erhöhte Breite für größere Herzen
          height: "60px", // Erhöhte Höhe für größere Herzen
          backgroundImage: `url(${heart})`,
          backgroundSize: "cover",
          imageRendering: "pixelated",
          margin: "0 5px", // Mehr Abstand zwischen Herzen
        }}
    ></div>
);

export default Heart;
