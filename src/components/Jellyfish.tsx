// Jellyfish.js
import React from "react";
import jellyfish from "/jellyfish.png";

const Jellyfish = ({ jellyFishPosition }) => {
  return (
      <img
          src={jellyfish}
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
