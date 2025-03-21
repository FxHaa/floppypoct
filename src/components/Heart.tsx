import heart from "/heart.png";
const Heart = () => (
    <div style={{
      display: 'inline-block',
      width: '40px',
      height: '40px',
      backgroundImage: heart, // Add a pixel-art heart image
      backgroundSize: 'cover',
      imageRendering: 'pixelated',
      margin: '0 2px'
    }} />
);

export default Heart;
