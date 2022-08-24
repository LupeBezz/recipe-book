/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import CreateRecipe from "./createrecipe";
import UpdateRecipe from "./updaterecipe";
import ContainerSearch from "./containersearch";
import ContainerPreview from "./containerpreview";
import ContainerRecipe from "./containerrecipe";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the App component

function App() {
    const [user, setUser] = useState([]);
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        fetch("/api/user-info")
            .then((response) => response.json())
            .then((data) => {
                //console.log("data after getRecipeById: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    setUser(data);
                }
            })
            .catch((error) => {
                console.log("error on fetch after getUserInfoById: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    return (
        <>
            <h1>Recipe Book - APP</h1>
            <h1>{user.first}</h1>

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
                    <Route path="/update-recipe/:id">
                        <UpdateRecipe />
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
