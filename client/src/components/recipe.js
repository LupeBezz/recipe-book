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
    const [color, setColor] = useState("black");

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
                    if (data.favorite == true) {
                        setFavorite(true);
                    } else {
                        setFavorite(false);
                    }
                    // setDirections(data.directions);
                    //console.log("data.directions: ", data.directions);
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

    const deleteRecipe = () => {
        console.log("deleting!");
        fetch(`/api/recipe-delete/${recipe.id}`)
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
                console.log("error on fetch after deleteRecipe: ", error);
                setErrorMessage("oops, something went wrong!");
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
        // var audio = new Audio("../../public/click-3.mp3");

        var minutes = timerRef.current.value;
        var milliseconds = minutes * 60 * 1000;
        setMinutes(minutes);
        console.log(milliseconds);
        timerRef.current.value = "";

        // set timeOut
        setTimeout(alert, milliseconds);

        function alert() {
            setAlert("time's up!");
            setTimeout(clear, 2000);
            // audio.play();
        }

        function clear() {
            setAlert("");
            setMinutes("");
        }
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
            <h2>DIRECTIONS</h2>
            {recipe && (
                <>
                    <img src={recipe.picture} />
                    {recipe.directions.map((direction, idx) => (
                        <li
                            key={idx}
                            onClick={markDone}
                            className={"recipe-directions"}
                        >
                            {direction}
                        </li>
                    ))}
                    <input
                        type="text"
                        id="timer-input"
                        ref={timerRef}
                        placeholder="min"
                    ></input>

                    <div className="icon-circle-00" onClick={setTimer}>
                        <span className="material-symbols-outlined">timer</span>
                    </div>

                    <div className="icon-circle-01" onClick={toggleFavorite}>
                        <span className="material-symbols-outlined">
                            favorite
                        </span>
                    </div>

                    <div className="icon-circle-02">
                        <Link to={`/update-recipe/${recipe.id}`}>
                            <span className="material-symbols-outlined">
                                refresh
                            </span>
                        </Link>
                    </div>

                    <div className="icon-circle-03">
                        <span
                            className="material-symbols-outlined"
                            onClick={insertMenu}
                        >
                            menu_book
                        </span>
                    </div>
                    <div className="icon-circle-04" onClick={deleteRecipe}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                    </div>
                </>
            )}
            {minutes && (
                <>
                    <h1>Timer set to {minutes} minutes</h1>
                    {alert && <h1>DONE</h1>}
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Recipe;
