// Pipes.js

import React from "react";
import fishViolet from "/fish_violet.png"; // Importiere das Bild direkt
import redFish from "/red_fish.png"; // Importiere das 2. Bild direkt
import yellowFish from "/fish_yellow.png"; // Importiere das 2. Bild direkt

const Fish = ({ fishPosition }) => {
  const imageSrc =
      fishPosition.image === "fish_violet.png"
          ? fishViolet
          : fishPosition.image === "fish_yellow.png"
              ? yellowFish
              : redFish; // Wähle das richtige Bild basierend auf dem `image`-Attribut
  return (
      <img
          src={imageSrc} // Verwende hier das ausgewählte Bild
          alt="fish"
          className="fish border-box"
          style={{
            left: fishPosition.x,
            top: fishPosition.y,
          }}
          draggable={true}
      />
  );
};

export default Fish;
