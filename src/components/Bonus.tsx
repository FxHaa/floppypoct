// Bird.js
import React from "react";
import treasure from "/treasure.png";

const Bonus = ({ bonusPosition }) => {
  return (
      <img
          src={treasure}
          alt="bird"
          className="bird"
          style={{
            left: bonusPosition.x,
            top: bonusPosition.y,
          }}
          draggable={true}
      />
  );
};

export default Bonus;