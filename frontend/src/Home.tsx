import React from "react";
import SearchBar from "./SearchBar";
// @ts-ignore
import ReactRotatingText from "react-rotating-text";
import "./Home.css";
import { Link, Router } from "react-router-dom";

export default function Home() {
  return (
    <div id="home">
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
      <div id="flexbox-content">
        <div id="main">
          <h1 id="rotating">
            <ReactRotatingText
              items={["Your comments", "Your advice", "Your opinions"]}
              pause={3500}
            />
          </h1>
          <h3 id="tagline">Uncensored. Community Moderated.</h3>
          <div id="wrapper">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
}
