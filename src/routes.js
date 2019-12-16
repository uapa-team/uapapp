import React from 'react'
import { Switch } from 'react-router-dom'

import LoginForm from "./js/Components/LoginForm";
import Contact from "./js/Components/Contact";
import Home from "./js/Components/Home"

import { ProtectedRoute } from './ProtectedRoute'
import { LoginRoute } from './LoginRoute'

export default props => (
    <Switch>
        <LoginRoute exact path="/" component={LoginForm} />
        <LoginRoute exact path="/contact" component={Contact} />
        <ProtectedRoute exact path="/home" component={Home} />
    </Switch>
)