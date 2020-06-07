import React, { useState } from "react";
import Navbar from "./Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";

type SignupData = {
  email: string;
  username: string;
  password: string;
};

export default function Signup() {
  const { register, handleSubmit, errors } = useForm<SignupData>();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const onSubmit = (data: SignupData) => {
    setServerErrors([]);
    fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          setIsSuccess(true);
        }
      })
      .catch((error) => setServerErrors([...serverErrors, error]));
  };
  return (
    <>
      {isSuccess ? (
        <Redirect to="/login" />
      ) : (
        <>
          <Navbar />
          <div id="login-wrapper">
            <div id="form-wrapper">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <h1>Sign up</h1>
                <h6>And start contributing to the community!</h6>
                <hr />
                {serverErrors.length > 0 &&
                  serverErrors.map((elem) => <span className="red"></span>)}
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    ref={register({ required: true })}
                  />
                  {errors.email && (
                    <span className="red">Email is required</span>
                  )}
                </Form.Group>
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
      )}
    </>
  );
}
