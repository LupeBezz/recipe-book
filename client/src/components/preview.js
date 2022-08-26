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
            <h2>PREVIEW</h2>
            {recipe && (
                <>
                    {/* <h2 onClick={() => openDirections(recipe.id)}>
                        {recipe.title}
                    </h2> */}

                    <Link to={`/recipe/${recipe.id}`}>
                        {recipe.title}
                        {/* <img src={recipe.picture}></img> */}
                    </Link>

                    {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                        // <input type="text" onChange={(e)=>{updateIngredient(e, idx)}}></input>
                    ))}
                </>
            )}
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
