import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/sign-up" exact>
          <h1>Sign up!</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
