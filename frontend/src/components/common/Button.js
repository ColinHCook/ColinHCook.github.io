import React from "react";
import "./Button.css"; // You should create a corresponding CSS file

const Button = ({ text, onClick, className }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
