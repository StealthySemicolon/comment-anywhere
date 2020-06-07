import "./Comments.css";

// @ts-ignore
import { Base64 } from "js-base64";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useCookies } from "react-cookie";

export default function Comments() {
  let { url } = useParams();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  url = decodeURIComponent(url);

  useEffect(() => {
    fetch(`http://localhost:5000/api/comments/${Base64.encode(url)}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setComments(res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }, [url, comments]);

  return (
    <>
      <Navbar />
      <h1>You requested: {url}</h1>
      {isLoading ? <h1>Loading...</h1> : <h1>Data : {comments}</h1>}
    </>
  );
}
