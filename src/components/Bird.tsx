// Bird.js
import React from "react";

const Bird = ({ birdPosition, isVisible = true }) => {
  return (
      <img
          src={"../../poctopus.png"}
          alt="bird"
          className={`bird ${!isVisible ? 'bird-invincible' : ''}`}
          style={{
            left: birdPosition.x,
            top: birdPosition.y,
          }}
          draggable={true}
      />
  );
};

export default Bird;
