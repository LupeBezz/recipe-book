/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import Recipe from "./recipe";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Preview component

function Preview(props) {
    const [recipe, setRecipe] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [directions, setDirections] = useState(false);
    const [clickedrecipe, setClickedRecipe] = useState();

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
                }
            })
            .catch((error) => {
                console.log("error on fetch after getRecipeById: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    const openDirections = (id) => {
        if (directions == false) {
            setDirections(true);
            setClickedRecipe(id);
            console.log("id: ", id);
        } else {
            setDirections(false);
        }
    };

    return (
        <>
            <div className="recipes-preview">
                {recipe && (
                    <>
                        <h1> {recipe.title.toUpperCase()}</h1>
                        <Link to={`/recipe/${recipe.id}`} id="link-directions">
                            <img
                                src={recipe.picture || "/recipe_default.jpg"}
                            />
                        </Link>

                        <ul className="ingredients-list">
                            {recipe.ingredients.map((ingredient, idx) => (
                                <li key={idx}> {ingredient}</li>
                            ))}
                        </ul>
                        <div id="recipes-preview-icons-div">
                            {recipe.favorite == true && (
                                <span className="recipes-preview-icons material-symbols-outlined">
                                    favorite
                                </span>
                            )}

                            {recipe.vegan == true && (
                                <span className="recipes-preview-icons material-symbols-outlined">
                                    nest_eco_leaf
                                </span>
                            )}
                            {recipe.servings && (
                                <span className="recipes-preview-icons">
                                    <span className="material-symbols-outlined">
                                        person
                                    </span>
                                    <span className="icons-text">
                                        {recipe.servings}
                                    </span>
                                </span>
                            )}
                            {recipe.duration && (
                                <span className="recipes-preview-icons">
                                    <span className="material-symbols-outlined">
                                        schedule
                                    </span>
                                    <span className="icons-text">
                                        {recipe.duration}min
                                    </span>
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
            {directions && (
                <>
                    <Recipe clickedrecipe={clickedrecipe} />
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Preview;
