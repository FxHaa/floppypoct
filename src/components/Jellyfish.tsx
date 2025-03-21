// Jellyfish.js
import React from "react";

const Jellyfish = ({ jellyFishPosition }) => {
  return (
      <img
          src={"../../jellyfish.png"}
          alt="jellyfish"
          className="bird border-box"
          style={{
            left: jellyFishPosition.x,
            top: jellyFishPosition.y,
          }}
          draggable={true}
      />
  );
};

export default Jellyfish;
