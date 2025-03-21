import React from "react";

const Anchor = ({ anchorPosition }) => {
  return (
      <img
          src={"../../anchor.png"}
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