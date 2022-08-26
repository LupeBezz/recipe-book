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
import Logout from "./logout";
import Menu from "./menu";
import Preview from "./preview";
import Groceries from "./groceries";
import Timer from "./timer";

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
            <BrowserRouter>
                <h1 id="username">{user.first}</h1>
                <Route exact path="/">
                    <div className="icons-container">
                        <Link
                            to="/create-recipe"
                            className="link-circle"
                            id="link-create"
                        >
                            <span className="material-symbols-outlined">
                                add
                            </span>
                        </Link>
                        <Link to="/menu" className="link-circle" id="link-menu">
                            <span className="material-symbols-outlined">
                                menu_book
                            </span>
                        </Link>

                        <Link
                            to="/logout"
                            className="link-circle"
                            id="link-logout"
                        >
                            <span className="material-symbols-outlined">
                                logout
                            </span>
                        </Link>
                    </div>
                    <div className="shapes-container">
                        <Link to="/search/main">
                            <div id="shape-main"></div>
                        </Link>
                        <Link to="/search/dessert">
                            <div id="shape-dessert"></div>
                        </Link>
                        <Link to="/search/snack">
                            <div id="shape-snack"></div>
                        </Link>
                    </div>
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
                {/* <Route exact path="/recipe/:id">
                    <Preview />
                </Route> */}
                <Route path="/recipe/:id">
                    <ContainerRecipe />
                </Route>
                <Route exact path="/menu/groceries">
                    <Groceries />
                </Route>
                <Route exact path="/menu">
                    <Menu />
                </Route>
                <Route exact path="/logout">
                    <Logout />
                </Route>
            </BrowserRouter>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default App;
