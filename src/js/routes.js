import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import LoginForm from "./Components/Login/Login";
import Contact from "./Components/Contact/Contact";
import Home from "./Components/Home/Home"
import RecFormat from "./Components/RecFormat/RecFormat"
import AdminUsers from "./Components/AdminUsers/AdminUsers"
import AdminPrograms from "./Components/AdminPrograms/AdminPrograms"
import GenerateReport from "./Components/GenerateReport/GenerateReport"

import { ProtectedRoute } from './ProtectedRoute'
import { LoginRoute } from './LoginRoute'
import auth from '../auth'

export default props => (
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
)