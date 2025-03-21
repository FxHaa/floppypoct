import React from "react";

const SeaUrchin = ({ seaUrchinPosition }) => {
  return (
      <img
          src={"../../seaurchin.png"}
          alt="seaurchin"
          className="bird border-box"
          style={{
            left: seaUrchinPosition.x,
            top: seaUrchinPosition.y,
          }}
          draggable={true}
      />
  );
};

export default SeaUrchin;