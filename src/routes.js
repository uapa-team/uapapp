import React from 'react'
import { Switch } from 'react-router-dom'

import LoginForm from "./js/Components/Login/Login";
import Contact from "./js/Components/Contact/Contact";
import Home from "./js/Components/Home/Home"

import { ProtectedRoute } from './ProtectedRoute'
import { LoginRoute } from './LoginRoute'

export default props => (
    <Switch>
        <LoginRoute exact path="/" component={LoginForm} />
        <LoginRoute exact path="/contact" component={Contact} />
        <ProtectedRoute exact path="/home" component={Home} />
    </Switch>
)