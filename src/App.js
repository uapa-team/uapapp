import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import LoginForm from "./js/Components/Login/Login";
import Contact from "./js/Components/Contact/Contact";
import Home from "./js/Components/Contact/Contact"
import RecFormat from "./js/Components/RecFormat/RecFormat"
import AdminUsers from "./js/Components/AdminUsers/AdminUsers"
import AdminPrograms from "./js/Components/AdminPrograms/AdminPrograms"
import GenerateReport from "./js/Components/GenerateReport/GenerateReport"
import UnalCanvas from "./js/UnalCanvas"

import { ProtectedRoute } from './js/ProtectedRoute'
import { LoginRoute } from './js/LoginRoute'
import auth from './auth'

class App extends Component {
  render() {
    return (
        <UnalCanvas>
              <Switch>
                <LoginRoute exact path="/" component={LoginForm} />
                <LoginRoute exact path="/contact" component={Contact} />
                <ProtectedRoute exact path="/home" component={Home} />
                <ProtectedRoute exact path="/admin_users" component={AdminUsers} />
                <ProtectedRoute exact path="/admin_programs" component={AdminPrograms} />
                <ProtectedRoute exact path="/generate_report" component={GenerateReport} />
                <ProtectedRoute exact path="/rec_format" component={RecFormat} />

                <Route path="*" component={() => "404 NOT FOUND"}>
                    {auth.isAuthenticated ? <Redirect to="/home" /> : <Redirect to="/" />}
                </Route> /> 
            </Switch>
        </UnalCanvas>
    );
  }
}

export default App;
