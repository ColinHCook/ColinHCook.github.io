import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Header.css"; // Make sure to create a Header.css file with the styles
import logoImage from "../../assets/images/shopping-cart-outline.svg"; // Update the path to your logo image file

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the logout function passed via props
    navigate("/"); // Redirect to home page
  };

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
        {isAuthenticated ? (
          <button onClick={handleLogout} className="nav-link">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
