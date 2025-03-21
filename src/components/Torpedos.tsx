import React from "react";

const Torpedos = ({ torpedoPosition }) => {
  return (
      <img
          src={
            "../../turtle2.png"
          }
          alt="turtle"
          className="turtle border-box"
          style={{
            left: torpedoPosition.x,
            top: torpedoPosition.y,
          }}
          draggable={true}
      />
  );
};

export default Torpedos;
