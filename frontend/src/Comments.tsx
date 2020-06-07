import "./Comments.css";

import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function Comments() {
  let { url } = useParams();
  return (
    <>
      <Navbar />
      <h1>You requested: {url}</h1>
    </>
  );
}
