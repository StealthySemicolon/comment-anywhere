import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav id="home-navbar">
      <h3 id="logo">
        <Link to="/">Comment Anywhere</Link>
      </h3>
      <ul id="navbar-items">
        <li className="link">
          <Link to="/login">Login</Link>
        </li>
        <li className="link">
          <Link to="/sign-up">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}
