// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export function Playground({ children }) {
  return (
      <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            background: "#000",
            width: "1920px",
            height: "1080px",
            border: "#333 2px solid ",
          }}
      >
        {children}
      </div>
  );
}
