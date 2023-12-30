import React from "react";
import "./Footer.css"; // Make sure to create a Footer.css file with the styles
import facebookIcon from "../../assets/images/fb.svg";
import linkedinIcon from "../../assets/images/linkin.svg";
import twitterIcon from "../../assets/images/twit.svg";
import instagramIcon from "../../assets/images/insta.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2>Clothes Shop.</h2>
          <p>
            Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis
            nisi dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate
            velit imperdiet dolor tempor tristique.
          </p>
          <div className="social-media-links">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h3>About us</h3>
          <ul>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                Services{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                Blogs{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                Contact Us{" "}
              </a>{" "}
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>
              {" "}
              <a href="" className="footer-link">
                {" "}
                Knowledge Base{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                Help{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                FAQ{" "}
              </a>{" "}
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Jobs</h3>
          <ul>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                Our Team{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                Leadership{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="/" className="footer-link">
                {" "}
                Privacy Policy{" "}
              </a>{" "}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
