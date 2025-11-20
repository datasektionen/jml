import React, { useState, useEffect } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import Methone from 'methone';
import Home from './Home';
import Admin from './Admin';
import useAuthorization from './useAuthorization';

import './App.css'

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
                        login_href: hasToken ? '/api/logout' : '/api/login',
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
