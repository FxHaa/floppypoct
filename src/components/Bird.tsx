// Bird.js
import React from "react";
import poctopus from "/poctopus.png";

const Bird = ({ birdPosition, isVisible = true }) => {
  return (
      <img
          src={poctopus}
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
