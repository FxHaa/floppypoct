import React from "react";
import anchor from "/anchor.png";

const Anchor = ({ anchorPosition }) => {
  return (
      <img
          src={anchor}
          alt="anchor"
          className="bird border-box"
          style={{
            left: anchorPosition.x,
            top: anchorPosition.y,
          }}
          draggable={true}
      />
  );
};

export default Anchor;