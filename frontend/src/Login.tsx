import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import { useCookies } from "react-cookie";
// @ts-ignore
import { Base64 } from "js-base64";
import { useForm } from "react-hook-form";

type LoginData = {
  username: string;
  password: string;
};

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies();

  const { register, handleSubmit, errors } = useForm<LoginData>();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    setCookie("auth", authToken);
  }, [authToken, setCookie]);

  const onSubmit = (data: LoginData) => {
    setServerErrors([]);
    fetch("http://localhost:5000", {
      method: "GET",
      headers: {
        Authorization: `Basic ${Base64.encode(
          data.username + ":" + data.password
        )}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setAuthToken(res))
      .catch((error) => setServerErrors([...serverErrors, error]));
  };
  return (
    <>
      <Navbar />
      <div id="login-wrapper">
        <div id="form-wrapper">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h1>Login</h1>
            <hr />
            {serverErrors.length > 0 &&
              serverErrors.map((elem) => <span className="red"></span>)}

            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="Enter username"
                ref={register({ required: true })}
              />
              {errors.username && (
                <span className="red">Username is required</span>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                ref={register({ required: true })}
              />
              {errors.password && (
                <span className="red">Password is required</span>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
