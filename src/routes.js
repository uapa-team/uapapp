import React from 'react'
import { Switch } from 'react-router-dom'

import LoginFormCanvas from "./js/Components/LoginFormCanvas";
import ContactCanvas from "./js/Components/ContactCanvas";
import HomeCanvas from "./js/Components/HomeCanvas"

import { ProtectedRoute } from './ProtectedRoute'
import { LoginRoute } from './LoginRoute'

export default props => (
    <Switch>
        <LoginRoute exact path="/" component={LoginFormCanvas} />
        <LoginRoute exact path="/contact" component={ContactCanvas} />
        <ProtectedRoute exact path="/home" component={HomeCanvas} />
    </Switch>
)