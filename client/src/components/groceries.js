/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Groceries component

function Groceries() {
    const [errorMessage, setErrorMessage] = useState();
    const [groceries, setGroceries] = useState("");

    useEffect(() => {
        fetch("/api/menu")
            .then((response) => response.json())
            .then((data) => {
                console.log("data after getMenu: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    setGroceries(data);
                }
            })
            .catch((error) => {
                console.log("error on fetch after getMenu: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    const markDone = (e) => {
        if (!e.currentTarget.className) {
            e.currentTarget.className = "groceries-marked";
        } else if (e.currentTarget.className == "groceries-unmarked") {
            e.currentTarget.className = "groceries-marked";
        } else if (e.currentTarget.className == "groceries-marked") {
            e.currentTarget.className = "groceries-unmarked";
        }
    };

    return (
        <>
            <div className="icons-container">
                <Link to="/" className="link-circle" id="link-home">
                    <span className="material-symbols-outlined">home</span>
                </Link>
            </div>
            <div id="groceries-list-all">
                {groceries.length > 0 && (
                    <div className="groceries-list">
                        <h1>GROCERIES</h1>
                        {groceries.map((recipe, idx) => (
                            <ul key={recipe.id}>
                                {recipe.ingredients.map((ingredient, idx) => (
                                    <li key={idx} onClick={markDone}>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Groceries;
