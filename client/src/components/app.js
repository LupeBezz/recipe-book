/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import CreateRecipe from "./createrecipe";
import ContainerSearch from "./containersearch";
import ContainerPreview from "./containerpreview";
import ContainerRecipe from "./containerrecipe";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the App component

function App() {
    return (
        <>
            <h1>Recipe Book - APP</h1>

            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Link to="/search/main">
                            <div id="shape-main"></div>
                        </Link>
                        <Link to="/search/dessert">
                            <div id="shape-dessert"></div>
                        </Link>
                        <Link to="/search/snack">
                            <div id="shape-snack"></div>
                        </Link>
                        <Link
                            to="/create-recipe"
                            className="link-circle"
                            id="link-create"
                        >
                            add
                        </Link>
                    </Route>
                    <Route exact path="/create-recipe">
                        <CreateRecipe />
                    </Route>
                    <Route path="/search/:category">
                        <ContainerSearch />
                    </Route>
                    <Route exact path="/preview">
                        <ContainerPreview />
                    </Route>
                    <Route exact path="/recipe">
                        <ContainerRecipe />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default App;
