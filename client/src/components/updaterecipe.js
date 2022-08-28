/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import CreateRecipe from "./createrecipe";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the UpdateRecipe component

function UpdateRecipe() {
    const [recipe, setRecipe] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [directions, setDirections] = useState([]);
    const [updateIngredients, setUpdateIngredients] = useState(false);
    const [updateDirections, setUpdateDirections] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { id } = useParams();

    const titleRef = useRef();
    const categoryRef = useRef();
    const ingredientsRef = useRef();
    const directionsRef = useRef();
    const ingredientsNewRef = useRef();
    const directionsNewRef = useRef();
    const servingsRef = useRef();
    const veganRef = useRef();
    const durationRef = useRef();

    useEffect(() => {
        //console.log("props.clickedrecipe in useEffect: ", props.clickedrecipe);
        fetch(`/api/recipe-preview/${id}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log("data after getRecipeById: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    setRecipe(data);
                    setIngredients(data.ingredients);
                    setDirections(data.directions);
                }
            })
            .catch((error) => {
                console.log("error on fetch after getRecipeById: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    const handleRecipeUpdate = (e) => {
        e.preventDefault();

        const recipeData = {
            title: titleRef.current.value,
            category: categoryRef.current.value,
            ingredients: ingredients,
            directions: directions,
            servings: servingsRef.current.value,
            vegan: veganRef.current.value,
            duration: durationRef.current.value,
            id: recipe.id,
        };

        console.log("recipeData: ", recipeData);

        fetch("/api/recipe-update", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    location.href = `/recipe/${data.id}`;
                }
            })
            .catch((error) => {
                console.log("error on fetch after insertRecipe: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    const handleIngredientInput = async () => {
        console.log("handling ingredient input");
        await setIngredients((prevIngredients) => [
            ...prevIngredients,
            ingredientsRef.current.value,
        ]);
        ingredientsRef.current.value = "";
    };

    const handleDirectionInput = async () => {
        console.log("handling direction input");
        await setDirections((prevDirections) => [
            ...prevDirections,
            directionsRef.current.value,
        ]);
        directionsRef.current.value = "";
    };

    const handleIngredientsEdit = async () => {
        //console.log("handling ingredients edit");

        const allIngredients = document.querySelectorAll(
            ".ingredients-updated"
        );
        const newIngredients = [];
        allIngredients.forEach((ref) => {
            newIngredients.push(ref.value);
        });
        console.log("newIngredients: ", newIngredients);

        setIngredients(newIngredients);
        setUpdateIngredients(false);
    };

    const handleDirectionsEdit = async () => {
        //console.log("handling directions edit");

        const allDirections = document.querySelectorAll(".directions-updated");
        const newDirections = [];
        allDirections.forEach((ref) => {
            newDirections.push(ref.value);
        });
        console.log("newDirections: ", newDirections);

        setDirections(newDirections);
        setUpdateDirections(false);
    };

    const inputIngredient = (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            console.log("input ingredient");
            console.log("e.target", e.target);
            handleIngredientInput();
        }
    };

    const inputDirection = (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            console.log("input direction");
            console.log("e.target", e.target);
            handleDirectionInput();
        }
    };

    const deleteIngredient = (idx) => {
        console.log("delete ingredient, idx: ", idx);

        setIngredients((prevIngredients) => [
            ...prevIngredients.slice(0, idx),
            ...prevIngredients.slice(idx + 1),
        ]);
    };

    const deleteDirection = (idx) => {
        console.log("delete direcion, idx: ", idx);

        setDirections((prevDirections) => [
            ...prevDirections.slice(0, idx),
            ...prevDirections.slice(idx + 1),
        ]);
    };

    const editIngredients = () => {
        if (updateIngredients == false) {
            setUpdateIngredients(true);
        } else {
            setUpdateIngredients(false);
        }
    };

    const editDirections = () => {
        if (updateDirections == false) {
            setUpdateDirections(true);
        } else {
            setUpdateDirections(false);
        }
    };

    const askDeleteRecipe = () => {
        setConfirmDelete(true);
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

    return (
        <>
            <h1>UPDATE RECIPE id {id}</h1>
            {recipe && (
                <>
                    <form
                        className="create-recipe"
                        method="post"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="text"
                            ref={titleRef}
                            defaultValue={recipe.title}
                            placeholder="Title"
                        ></input>

                        <select
                            name="category"
                            id="recipe-category"
                            ref={categoryRef}
                            defaultValue={recipe.category}
                        >
                            <option hidden>category</option>
                            <option value="main">main</option>
                            <option value="dessert">dessert</option>
                            <option value="starter">starter</option>
                        </select>

                        <input
                            type="text"
                            name="ingredients"
                            ref={ingredientsRef}
                            placeholder="Additional Ingredients"
                            onKeyUp={inputIngredient}
                        ></input>

                        <input
                            type="text"
                            name="directions"
                            ref={directionsRef}
                            placeholder="Additional directions"
                            onKeyUp={inputDirection}
                        ></input>

                        <input
                            type="number"
                            name="servings"
                            ref={servingsRef}
                            placeholder="Servings"
                            defaultValue={recipe.servings}
                        ></input>

                        <select
                            name="vegan"
                            id="recipe-vegan"
                            ref={veganRef}
                            defaultValue={recipe.vegan}
                        >
                            <option hidden>vegan</option>
                            <option value="true">yes</option>
                            <option value="false">no</option>
                        </select>

                        <input
                            type="number"
                            name="duration"
                            ref={durationRef}
                            placeholder="Duration (minutes)"
                            defaultValue={recipe.duration}
                        ></input>
                    </form>

                    <button
                        className="recipe-input-button"
                        onClick={handleRecipeUpdate}
                    >
                        update recipe
                    </button>

                    {ingredients && (
                        <>
                            <h1>current ingredients</h1>

                            <ul className="ingredient-added">
                                {ingredients.map((ingredient, idx) => (
                                    <li key={idx}>
                                        <button
                                            onClick={() =>
                                                deleteIngredient(idx)
                                            }
                                        >
                                            x
                                        </button>
                                        {!updateIngredients && (
                                            <>{ingredient}</>
                                        )}
                                        {updateIngredients && (
                                            <>
                                                <input
                                                    type="text"
                                                    className="ingredients-updated"
                                                    name={`ingredient-${idx}`}
                                                    ref={ingredientsNewRef}
                                                    defaultValue={ingredient}
                                                ></input>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {!updateIngredients && (
                                <>
                                    <button onClick={editIngredients}>
                                        edit
                                    </button>
                                </>
                            )}

                            {updateIngredients && (
                                <>
                                    <button onClick={handleIngredientsEdit}>
                                        ok
                                    </button>
                                </>
                            )}
                        </>
                    )}

                    {directions && (
                        <>
                            <h1>current directions</h1>

                            <ul className="direction-added">
                                {directions.map((direction, idx) => (
                                    <li key={idx}>
                                        <button
                                            onClick={() => deleteDirection(idx)}
                                        >
                                            x
                                        </button>
                                        {!updateDirections && <>{direction}</>}
                                        {updateDirections && (
                                            <>
                                                <input
                                                    type="text"
                                                    className="directions-updated"
                                                    name={`direction-${idx}`}
                                                    ref={directionsNewRef}
                                                    defaultValue={direction}
                                                ></input>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {!updateDirections && (
                                <>
                                    <button onClick={editDirections}>
                                        edit
                                    </button>
                                </>
                            )}

                            {updateDirections && (
                                <>
                                    <button onClick={handleDirectionsEdit}>
                                        ok
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            <Link to="/" className="link-circle" id="link-home">
                <span className="material-symbols-outlined">home</span>
            </Link>
            <div className="link-circle" onClick={askDeleteRecipe}>
                <span className="material-symbols-outlined priority">
                    delete
                </span>
            </div>
            {confirmDelete && (
                <div className="link-ellipse" onClick={deleteRecipe}>
                    <p>SURE?</p>
                </div>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default UpdateRecipe;
