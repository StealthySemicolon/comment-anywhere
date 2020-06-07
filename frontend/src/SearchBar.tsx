import React from "react";
export default function SearchBar() {
  return (
    <form id="search-form">
      <input
        type="text"
        placeholder="Enter a URL"
        id="search-box"
        className="form-item"
      />
      <button type="submit" id="submit-button" className="form-item">
        <span className="fa fa-search"></span>
      </button>
    </form>
  );
}
