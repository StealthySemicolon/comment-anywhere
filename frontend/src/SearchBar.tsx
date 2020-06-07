import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";

type QueryData = {
  query: string;
};

export default function SearchBar(props: any) {
  const { register, handleSubmit } = useForm<QueryData>();
  const [submitData, setSubmitData] = useState("");
  const onSubmit = (data: QueryData) => setSubmitData(data.query);
  return submitData !== "" ? (
    <Redirect to={`/comments/${encodeURIComponent(submitData)}`} />
  ) : (
    <form id="search-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        name="query"
        placeholder="Enter a URL"
        id="search-box"
        className="form-item"
        autoComplete="off"
        ref={register}
      />
      <button type="submit" id="submit-button" className="form-item">
        <span className="fa fa-search"></span>
      </button>
    </form>
  );
}
