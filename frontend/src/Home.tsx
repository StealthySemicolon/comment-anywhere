import React from "react";
import SearchBar from "./SearchBar";
// @ts-ignore
import ReactRotatingText from "react-rotating-text";
import "./Home.css";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div id="home">
      <Navbar />
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
