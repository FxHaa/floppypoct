import React from "react";
import turtle from "/turtle2.png";

const Torpedos = ({ torpedoPosition }) => {
  return (
      <img
          src={
            turtle
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
