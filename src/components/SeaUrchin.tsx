import React from "react";
import seaurchin from "/seaurchin.png";

const SeaUrchin = ({ seaUrchinPosition }) => {
  return (
      <img
          src={seaurchin}
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