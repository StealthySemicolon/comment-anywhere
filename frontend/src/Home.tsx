import React from "react";
import SearchBar from "./SearchBar";
import "./Home.css";

export default function Home() {
  return (
    <div id="home">
      <div id="main">
        <h1 id="logo">Comment Anywhere</h1>
        <h3 id="tagline">No Censorship. Community Moderated.</h3>
        <div id="wrapper">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
