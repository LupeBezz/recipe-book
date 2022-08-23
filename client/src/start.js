/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import React from "react";
import ReactDOM from "react-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import App from "./components/app";
import Welcome from "./components/welcome";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check if visitor is logged in

fetch("/api/check/userId")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            // visitor not logged in
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            // visitor logged in
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });
