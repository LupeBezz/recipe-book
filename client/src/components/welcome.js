/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { BrowserRouter, Route, Redirect } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import Login from "./login";
import Registration from "./registration";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Welcome component

function Welcome() {
    return (
        <>
            <h1>Recipe Book - WELCOME</h1>
            <BrowserRouter>
                <div id="welcome-reg-login">
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Welcome;
