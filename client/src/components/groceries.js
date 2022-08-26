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

    return (
        <>
            <h1>Groceries</h1>
            {groceries.length > 0 && (
                <div className="menu-list">
                    {groceries.map((recipe, idx) => (
                        <ul key={recipe.id}>
                            {recipe.ingredients.map((ingredient, idx) => (
                                <li key={idx}>{ingredient}</li>
                            ))}
                        </ul>
                    ))}
                </div>
            )}
            <Link to="/" className="link-circle" id="link-home">
                <span className="material-symbols-outlined">home</span>
            </Link>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Groceries;
