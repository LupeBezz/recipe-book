/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import Timer from "./timer";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Recipe component

function Recipe(props) {
    const [recipe, setRecipe] = useState();
    const [update, setUpdate] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [favorite, setFavorite] = useState(false);
    const [minutes, setMinutes] = useState();
    const [alert, setAlert] = useState();
    const [alertFavorite, setAlertFavorite] = useState(false);
    const [color, setColor] = useState("black");
    const [category, setCategory] = useState();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const timerRef = useRef();

    useEffect(() => {
        //console.log("props.clickedrecipe in useEffect: ", props.clickedrecipe);
        fetch(`/api/recipe-preview/${props.clickedrecipe}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data after getRecipeById: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    setRecipe(data);
                    setCategory(data.category);
                    if (data.favorite == true) {
                        setFavorite(true);
                    } else {
                        setFavorite(false);
                    }
                }
            })
            .catch((error) => {
                console.log("error on fetch after getRecipeById: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    const insertMenu = () => {
        console.log("inserting menu");

        fetch(`/api/menu-insert/${recipe.id}`, {
            method: "post",
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log("data: ", data);
                console.log("success after insertIntoMenu");
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                }
            })
            .catch((error) => {
                console.log("error on fetch after insertIntoMenu", error);
            });
    };

    const markDone = (e) => {
        if (e.currentTarget.className == "recipe-directions-done") {
            e.currentTarget.className = "recipe-directions";
        } else {
            e.currentTarget.className = "recipe-directions-done";
        }
    };

    const setTimer = () => {
        // calculate milliseconds for the timer
        setAlert("");
        setMinutes("");

        var minutes = timerRef.current.value;
        var milliseconds = minutes * 60 * 1000;
        setMinutes(minutes);
        console.log(milliseconds);
        timerRef.current.value = "";

        // set timeOut
        setTimeout(alert, milliseconds);

        function alert() {
            setAlert(true);
            // setTimeout(clear, 2000);
        }

        // function clear() {
        //     setMinutes("");
        // }
    };

    const toggleFavorite = () => {
        var favOrNot;
        if (favorite == true) {
            favOrNot = false;
        } else {
            favOrNot = true;
        }
        console.log("setting favorite!");
        fetch(`/api/recipe/favorite/${recipe.id}/${favOrNot}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    if (favorite == true) {
                        setFavorite(false);
                    } else {
                        setFavorite(true);
                        setAlertFavorite(true);
                    }
                }
            })
            .catch((error) => {
                console.log("error on fetch after setFavorite: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    return (
        <>
            {category == "starter" && (
                <img id="starter-bgr" src="/starter_bgr.svg" />
            )}
            {category == "main" && <img id="main-bgr" src="/main_bgr.svg" />}
            {category == "dessert" && (
                <img id="dessert-bgr" src="/dessert_bgr.svg" />
            )}

            {recipe && (
                <>
                    <div className="icons-container">
                        <Link to="/" className="link-circle" id="link-home">
                            <span className="material-symbols-outlined">
                                home
                            </span>
                        </Link>

                        <input
                            type="text"
                            id="timer-input"
                            className="link-circle"
                            ref={timerRef}
                            placeholder="min"
                        ></input>

                        <div className="link-circle" onClick={setTimer}>
                            <span className="material-symbols-outlined">
                                timer
                            </span>
                        </div>

                        <div className="link-circle" onClick={toggleFavorite}>
                            <span className="material-symbols-outlined">
                                favorite
                            </span>
                        </div>

                        <Link
                            to={`/update-recipe/${recipe.id}`}
                            className="link-circle"
                        >
                            <span className="material-symbols-outlined">
                                refresh
                            </span>
                        </Link>

                        <div className="link-circle">
                            <span
                                className="material-symbols-outlined"
                                onClick={insertMenu}
                            >
                                menu_book
                            </span>
                        </div>
                    </div>

                    <div className="recipes-middle-line"></div>

                    <div className="recipes-directions">
                        <h1>STEPS</h1>
                        <ul className="recipe-list directions-list">
                            {recipe.directions.map((direction, idx) => (
                                <li key={idx} onClick={markDone}>
                                    <span className="material-symbols-outlined">
                                        check_box_outline_blank
                                    </span>
                                    {direction}
                                </li>
                            ))}
                        </ul>

                        {minutes && (
                            <>
                                <div className="alert-middle-line"></div>
                                <h1 id="timer">
                                    TIMER SET TO {minutes} MINUTES
                                </h1>
                            </>
                        )}
                        {alert && <h1 id="timer-done">TIME IS UP!</h1>}
                    </div>
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Recipe;
