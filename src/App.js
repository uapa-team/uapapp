import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import LoginForm from "./js/Components/Login";
import Contact from "./js/Components/Contact";
import Home from "./js/Components/Home";
import RecFormat from "./js/Components/RecFormat";
import AdminUsers from "./js/Components/AdminUsers";
import AdminPrograms from "./js/Components/AdminPrograms";
import GenerateReport from "./js/Components/GenerateReport";
import UnalCanvas from "./js/Basics/UnalCanvas";

import { ProtectedRoute } from "./js/Basics/ProtectedRoute";
import { LoginRoute } from "./js/Basics/LoginRoute";
import auth from "./js/Basics/auth";

class App extends Component {
  render() {
    return (
      <UnalCanvas>
        <Switch>
          <LoginRoute exact path="/" component={LoginForm} />
          <LoginRoute exact path="/contact" component={Contact} />
          <ProtectedRoute exact path="/home" component={Home} />
          <ProtectedRoute exact path="/admin_users" component={AdminUsers} />
          <ProtectedRoute
            exact
            path="/admin_programs"
            component={AdminPrograms}
          />
          <ProtectedRoute
            exact
            path="/generate_report"
            component={GenerateReport}
          />
          <ProtectedRoute exact path="/rec_format" component={RecFormat} />
          <Route path="*" component={() => "404 NOT FOUND"}>
            {auth.isAuthenticated ? (
              <Redirect to="/home" />
            ) : (
              <Redirect to="/" />
            )}
          </Route>{" "}
          />
        </Switch>
      </UnalCanvas>
    );
  }
}

export default App;
