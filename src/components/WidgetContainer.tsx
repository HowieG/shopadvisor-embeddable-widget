import { h, Component } from "preact";
import { useState } from "preact/hooks";

const WidgetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const containerStyle = {
    position: "fixed",
    bottom: "70px",
    right: "20px",
    width: "200px",
    height: isOpen ? "200px" : "0",
    backgroundColor: "blue",
    color: "white",
    padding: isOpen ? "20px" : "0",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "height 0.3s ease-in-out, padding 0.3s ease-in-out",
  };

  const buttonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    cursor: "pointer",
  };

  return (
    <div>
      <div style={containerStyle}>
        {isOpen && <p>This is a fixed container</p>}
      </div>
      <div style={buttonStyle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "-" : "+"}
      </div>
    </div>
  );
};

export default WidgetContainer;
