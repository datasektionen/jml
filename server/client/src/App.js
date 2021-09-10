import React, { useState, useEffect, createContext } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import Methone from 'methone';
import Home from './Home';
import Admin from './Admin';
import useAuthorization from './useAuthorization';

import './App.css'

export const url = (path) => process.env.REACT_APP_BASE_URL + path
export const AdminContext = React.createContext({ loading: true, admin: [] })

const defaultLinks = [
    <Link to="/" key={"methonel-1"}>Anmälan och frågor</Link>,
];

const App = () => {

    const [methoneLinks, setMethoneLinks] = useState(defaultLinks);
    const { admin, loading, hasToken } = useAuthorization()

    useEffect(() => {
        if (admin) {
            setMethoneLinks([...defaultLinks].concat(
                <Link to="/admin" key={"methonel-admin"}>Administrera</Link>,
            ))
        }
    }, [admin, loading])

    return (
        <AdminContext.Provider value={{ loading, admin }}>
            <div id="application" className="cerise">
                <Methone
                    config={{
                        system_name: 'jml',
                        color_scheme: 'cerise',
                        links: methoneLinks,
                        login_href: hasToken ? '/logout' : '/login',
                        login_text: hasToken ? 'Logga ut' : 'Logga in',
                    }}
                />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/admin">
                        <Admin />
                    </Route>
                    <Route exact path="/login" render={match => {
                        window.location = `https://login.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/`
                        return <div></div>
                    }} />
                    <Route exact path="/logout" render={({ match }) => {
                        localStorage.removeItem("token")
                        window.location = "/"
                        return <div></div>
                    }} />
                    <Route exact path="/token/:token" render={({ match }) => {
                        localStorage.setItem("token", match.params.token)
                        return <Redirect to="/admin" />
                    }} />
                    {/* 404, redirect to home */}
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </AdminContext.Provider>
    )
}

export default App;