import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from '../auth'

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    var PrRoutes = ["/home", "/admin_users", "/admin_programs", "/generate_report", "/rec_format"]
    return (
        <Route
            {...rest}
            render={props => {
                if (auth.isAuthenticated()) {
                    if (PrRoutes.includes(props.location.pathname)){
                        return <Component {...props} />
                    } else {
                        return <Redirect to={
                            {
                                pathname: "/home",
                                state: {
                                    from: props.location
                                }
                            }
                        } />                        
                    }
                } else {
                    //alert('Su sesión a finalizado. Por favor vuelva a autenticarse.')
                    return <Redirect to={
                        {
                            pathname: "/",
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }
            } />
    )
}