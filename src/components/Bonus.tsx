// Bird.js
import React from "react";

const Bonus = ({ bonusPosition }) => {
  return (
      <img
          src={"../../treasure.png"}
          alt="bird"
          className="bird border-box"
          style={{
            left: bonusPosition.x,
            top: bonusPosition.y,
          }}
          draggable={true}
      />
  );
};

export default Bonus;