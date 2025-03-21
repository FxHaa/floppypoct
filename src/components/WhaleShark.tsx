import React from "react";

const WhaleShark = ({ whaelSharkPosition }) => {
  return (
      <img
          src={
            "../../whaleshark.png"
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
