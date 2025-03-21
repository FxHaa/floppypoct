import React from "react";
import whaleshark from "/whaleshark.png";

const WhaleShark = ({ whaelSharkPosition }) => {
  return (
      <img
          src={
            whaleshark
          }
          alt="whaleshark"
          className="whaleshark border-box"
          style={{
            left: whaelSharkPosition.x,
            top: whaelSharkPosition.y,
          }}
          draggable={true}
      />
  );
};

export default WhaleShark;
