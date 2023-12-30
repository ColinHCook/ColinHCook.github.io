import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using react-router-dom for navigation
import "./Header.css"; // Make sure to create a Header.css file with the styles
import logoImage from "../../assets/images/shopping-cart-outline.svg"; // Update the path to your logo image file

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img
          src={logoImage}
          alt="Modern Interior Design Studio"
          className="logo"
        />
      </Link>
      <nav className="header-nav">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/shop" className="nav-link">
          Shop
        </Link>
        <Link to="/about" className="nav-link">
          About Us
        </Link>
        <Link to="/cart" className="nav-link">
          Cart
        </Link>
      </nav>
    </header>
  );
};

export default Header;
