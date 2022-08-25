/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the InsertGroceries component

function Groceries() {
    const [errorMessage, setErrorMessage] = useState();
    const [groceries, setGroceries] = useState("");

    useEffect(() => {
        //console.log("props.clickedrecipe in useEffect: ", props.clickedrecipe);
        fetch("/api/groceries")
            .then((response) => response.json())
            .then((data) => {
                console.log("data after getGroceries: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    setGroceries(data);
                }
            })
            .catch((error) => {
                console.log("error on fetch after getGroceries: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    const deleteGroceries = () => {
        console.log("deleting!");
        fetch("/api/groceries-delete")
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    location.href = "/";
                }
            })
            .catch((error) => {
                console.log("error on fetch after deleteGroceries: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    return (
        <>
            <h1>shopping list</h1>
            {groceries.length > 0 && (
                <>
                    <div className="groceries-list">
                        {groceries.map((grocery, idx) => (
                            <div key={idx}>
                                <h2 key={grocery.id}>{grocery.title}</h2>
                                <ul>
                                    {grocery.ingredients.map(
                                        (ingredient, idx) => (
                                            <li key={idx}>{ingredient}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="link-circle" onClick={deleteGroceries}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                    </div>
                </>
            )}

            {groceries.length == 0 && (
                <>
                    <h2>you have no items!</h2>
                </>
            )}
            <Link to="/" className="link-circle" id="link-home">
                <span className="material-symbols-outlined">home</span>
            </Link>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Groceries;
