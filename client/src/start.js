/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import React from "react";
import ReactDOM from "react-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import App from "./components/App";
import Welcome from "./components/welcome";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ReactDOM.render()

//ReactDOM.render(<App />, document.querySelector("main"));

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
