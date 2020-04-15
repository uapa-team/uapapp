import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";

import LoginForm from "./js/Components/Login";
import Contact from "./js/Components/Contact";
import Home from "./js/Components/Home";
import RecFormat from "./js/Components/RecFormat";
import AdminUsers from "./js/Components/AdminUsers";
import AdminPrograms from "./js/Components/AdminPrograms";
import GenerateReport from "./js/Components/GenerateReport";
import UnalCanvas from "./js/Basics/UnalCanvas";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("jwt") != null ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("jwt") == null ? (
        <Component {...props} />
      ) : (
        <Redirect to="/home" />
      )
    }
  />
);

ReactDOM.render(
  <BrowserRouter>
    <UnalCanvas>
      <Switch>
        <LoginRoute exact path="/" component={LoginForm} />
        <Route exact path="/contact" component={Contact} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/admin_users" component={AdminUsers} />
        <PrivateRoute exact path="/admin_programs" component={AdminPrograms} />
        <PrivateRoute
          exact
          path="/generate_report"
          component={GenerateReport}
        />
        <PrivateRoute exact path="/rec_format" component={RecFormat} />
        <Route path="*" component={() => "404 NOT FOUND"}>
          {localStorage.getItem("jwt") != null ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/" />
          )}
        </Route>{" "}
        />
      </Switch>
    </UnalCanvas>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
