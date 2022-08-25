/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Recipe component

function Recipe(props) {
    const [recipe, setRecipe] = useState();
    const [update, setUpdate] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    // const [directions, setDirections] = useState([]);
    // const [directionDone, setDirectionDone] = useState();
    const [color, setColor] = useState("black");

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
                    // setDirections(data.directions);
                    //console.log("data.directions: ", data.directions);
                }
            })
            .catch((error) => {
                console.log("error on fetch after getRecipeById: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    // useEffect(() => {
    //     console.log("directions: ", directions);
    //     console.log("directions.length: ", directions.length);
    //     var tempArray = new Array(directions.length).fill(false);
    //     setDirectionDone(tempArray);
    //     console.log("tempArray: ", tempArray);
    //     //console.log("directionDone: ", directionDone);
    // }, [directions]);

    const insertGroceries = () => {
        console.log("inserting groceries");

        fetch(`/api/groceries-insert/${recipe.id}`, {
            method: "post",
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log("data: ", data);
                console.log("success after insertIntoGroceries");
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                }
            })
            .catch((error) => {
                console.log("error on fetch after insertIntoGroceries", error);
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

    // const markDone = (idx) => {
    //     console.log("marking idx: ", idx);
    //     // directionDone[idx] = true;
    //     // setDirectionDone(directionDone);
    //     if (directionDone[idx] == true) {
    //         directionDone[idx] = false;
    //     } else {
    //         directionDone[idx] = true;
    //     }
    //     setDirectionDone(directionDone);

    //     console.log("directionDone: ", directionDone);
    //     // setColor("gray");
    // };

    const markDoneII = (e) => {
        if (e.currentTarget.className == "recipe-directions-done") {
            e.currentTarget.className = "recipe-directions";
        } else {
            e.currentTarget.className = "recipe-directions-done";
        }
    };

    return (
        <>
            <h2>DIRECTIONS</h2>
            {recipe && (
                <>
                    {recipe.directions.map((direction, idx) => (
                        <li
                            key={idx}
                            onClick={markDoneII}
                            className={"recipe-directions"}
                        >
                            {direction}
                        </li>
                    ))}

                    <div className="icon-circle-01">
                        <Link to={`/update-recipe/${recipe.id}`}>
                            <span className="material-symbols-outlined">
                                refresh
                            </span>
                        </Link>
                    </div>

                    <div className="icon-circle-02">
                        <span
                            className="material-symbols-outlined"
                            onClick={insertGroceries}
                        >
                            shopping_bag
                        </span>
                    </div>
                    <div className="icon-circle-03" onClick={deleteRecipe}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                    </div>
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Recipe;
