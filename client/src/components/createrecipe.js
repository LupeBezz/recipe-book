/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the CreateRecipe component

function CreateRecipe() {
    const [errorMessage, setErrorMessage] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [directions, setDirections] = useState([]);
    const [image, setImage] = useState("");

    const titleRef = useRef();
    const categoryRef = useRef();
    const ingredientsRef = useRef();
    const directionsRef = useRef();
    const servingsRef = useRef();
    const difficultyRef = useRef();
    const veganRef = useRef();
    const subcategoryRef = useRef();
    const durationRef = useRef();
    const notesRef = useRef();
    const pictureRef = useRef();

    const handleRecipeInput = (e) => {
        e.preventDefault();
        clearErrors();

        const recipeData = {
            title: titleRef.current.value,
            category: categoryRef.current.value,
            ingredients: ingredients,
            directions: directions,
            servings: servingsRef.current.value,
            difficulty: difficultyRef.current.value,
            vegan: veganRef.current.value,
            subcategory: subcategoryRef.current.value,
            duration: durationRef.current.value,
            notes: notesRef.current.value,
        };

        console.log("recipeData: ", recipeData);

        fetch("/api/recipe-upload", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeData),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log("data: ", data);

                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                    clearFields();
                } else {
                    // location.href = "/";
                    if (pictureRef.current.value) {
                        const formData = new FormData();
                        formData.append("picture", pictureRef.current.files[0]);
                        formData.append("id", data.id);

                        fetch("/api/picture-upload", {
                            method: "post",
                            body: formData,
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                //console.log("data: ", data);
                                console.log(
                                    "success after fetch after create recipe"
                                );
                                if (!data.success && data.message) {
                                    setErrorMessage(data.message);
                                } else {
                                    clearFields();
                                }
                            })
                            .catch((error) => {
                                console.log(
                                    "error on fetch after insertPictureIntoRecipe: ",
                                    error
                                );
                                setErrorMessage("oops, something went wrong!");
                            });
                    }
                }
            })
            .catch((error) => {
                console.log("error on fetch after insertRecipe: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    const clearErrors = () => {
        setErrorMessage("");
    };

    const clearFields = () => {
        titleRef.current.value = "";
        categoryRef.current.value = "";
        ingredientsRef.current.value = "";
        directionsRef.current.value = "";
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
        console.log("idx: ", idx);

        setIngredients((prevIngredients) => [
            ...prevIngredients.slice(0, idx),
            ...prevIngredients.slice(idx + 1),
        ]);
    };

    const deleteDirection = (idx) => {
        console.log("idx: ", idx);

        setDirections((prevDirections) => [
            ...prevDirections.slice(0, idx),
            ...prevDirections.slice(idx + 1),
        ]);
    };

    return (
        <>
            <div>
                <form
                    className="create-recipe"
                    method="post"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="text"
                        ref={titleRef}
                        placeholder="Title"
                        onClick={clearErrors}
                    ></input>

                    <select
                        name="category"
                        id="recipe-category"
                        ref={categoryRef}
                    >
                        <option hidden>category</option>
                        <option value="main">main</option>
                        <option value="dessert">dessert</option>
                        <option value="snack">snack</option>
                    </select>

                    <input
                        type="text"
                        name="ingredients"
                        ref={ingredientsRef}
                        placeholder="Ingredients"
                        onKeyUp={inputIngredient}
                    ></input>

                    <input
                        type="text"
                        name="directions"
                        ref={directionsRef}
                        placeholder="Directions"
                        onKeyUp={inputDirection}
                    ></input>

                    <input
                        type="number"
                        name="servings"
                        ref={servingsRef}
                        placeholder="Servings"
                    ></input>

                    <input
                        type="number"
                        name="difficulty"
                        ref={difficultyRef}
                        placeholder="Difficulty (1-5)"
                        min="1"
                        max="5"
                    ></input>

                    <select name="vegan" id="recipe-vegan" ref={veganRef}>
                        <option hidden>vegan</option>
                        <option value="true">yes</option>
                        <option value="false">no</option>
                    </select>

                    <select
                        name="subcategory"
                        id="recipe-subcategory"
                        ref={subcategoryRef}
                    >
                        <option hidden>subcategory</option>
                        <option disabled>main</option>
                        <option value="salad">salad</option>
                        <option value="soup">soup</option>
                        <option disabled>dessert</option>
                        <option value="cookies">cookies</option>
                        <option value="cake">cake</option>
                    </select>

                    <input
                        type="number"
                        name="duration"
                        ref={durationRef}
                        placeholder="Duration (minutes)"
                    ></input>

                    <textarea
                        name="notes"
                        rows="4"
                        cols="50"
                        ref={notesRef}
                        placeholder="Notes"
                    ></textarea>

                    <input
                        type="file"
                        name="uploadPicture"
                        ref={pictureRef}
                        accept="image/*"
                    />
                </form>
                <button
                    className="recipe-input-button"
                    onClick={handleRecipeInput}
                >
                    upload
                </button>

                {ingredients && (
                    <>
                        <h1>added ingredients</h1>
                        <ul className="ingredient-added">
                            {ingredients.map((ingredient, idx) => (
                                <li key={idx}>
                                    <button
                                        onClick={() => deleteIngredient(idx)}
                                    >
                                        x
                                    </button>
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {directions && (
                    <>
                        <h1>added directions</h1>
                        <ul className="direction-added">
                            {directions.map((direction, idx) => (
                                <li key={idx}>
                                    <button
                                        onClick={() => deleteDirection(idx)}
                                    >
                                        x
                                    </button>
                                    {direction}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
            <Link to="/" className="link-circle" id="link-home">
                <span className="material-symbols-outlined">home</span>
            </Link>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default CreateRecipe;
