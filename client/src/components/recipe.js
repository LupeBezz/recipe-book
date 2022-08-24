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

    useEffect(() => {
        //console.log("props.clickedrecipe in useEffect: ", props.clickedrecipe);
        fetch(`/api/recipe-preview/${props.clickedrecipe}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log("data after getRecipeById: ", data);
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

    return (
        <>
            <h2>DIRECTIONS</h2>
            {recipe && (
                <>
                    {recipe.directions.map((direction, idx) => (
                        <li key={idx}>{direction}</li>
                        // <input type="text" onChange={(e)=>{updateIngredient(e, idx)}}></input>
                    ))}
                    <Link to={`/update-recipe/${recipe.id}`}>
                        <button>update recipe</button>
                    </Link>
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Recipe;
