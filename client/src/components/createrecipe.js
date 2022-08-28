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
    // const [newRecipeId, setNewRecipeId] = useState("");

    const titleRef = useRef();
    const categoryRef = useRef();
    const categoryScrapeRef = useRef();
    const ingredientsRef = useRef();
    const directionsRef = useRef();
    const servingsRef = useRef();
    const veganRef = useRef();
    const durationRef = useRef();
    const pictureRef = useRef();
    const urlRef = useRef();

    const handleRecipeInput = (e) => {
        e.preventDefault();
        clearErrors();

        const recipeData = {
            title: titleRef.current.value,
            category: categoryRef.current.value,
            ingredients: ingredients,
            directions: directions,
            servings: servingsRef.current.value,
            vegan: veganRef.current.value,
            duration: durationRef.current.value,
        };

        console.log("recipeData: ", recipeData);
        var newRecipeId;

        fetch("/api/recipe-upload", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                // setNewRecipeId(data.id);
                newRecipeId = data.id;

                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                    clearFields();
                } else {
                    // location.href = `/recipe/${data.id}`;
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
                                console.log("data: ", data);
                                console.log(
                                    "success after fetch after create recipe"
                                );
                                if (!data.success && data.message) {
                                    setErrorMessage(data.message);
                                    console.log(
                                        "error after uploading picture: ",
                                        data.message
                                    );
                                } else {
                                    // clearFields();
                                    location.href = `/recipe/${newRecipeId}`;
                                }
                            })
                            .catch((error) => {
                                console.log(
                                    "error on fetch after insertPictureIntoRecipe: ",
                                    error
                                );
                                setErrorMessage("oops, something went wrong!");
                            });
                    } else {
                        location.href = `/recipe/${newRecipeId}`;
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

    const scrapeRecipe = () => {
        console.log("ready to scrape a recipe");
        console.log("urlRef.current.value", urlRef.current.value);
        var newRecipeId;

        const recipeUrl = {
            url: urlRef.current.value,
            category: categoryScrapeRef.current.value,
        };

        fetch("/api/recipe-scrape", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeUrl),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                newRecipeId = data.id;

                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                    clearFields();
                } else {
                    console.log("ok");
                    location.href = `/update-recipe/${newRecipeId}`;
                }
            })
            .catch((error) => {
                console.log("error on fetch after insertRecipe: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    return (
        <>
            <div className="icons-container">
                <Link to="/" className="link-circle" id="link-home">
                    <span className="material-symbols-outlined">home</span>
                </Link>
            </div>
            <div className="recipe-form-page">
                <div className="recipe-form">
                    <h1>NEW RECIPE</h1>
                    <form
                        method="post"
                        id="recipe-form"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            className="input-long"
                            type="text"
                            ref={titleRef}
                            placeholder="title"
                            onClick={clearErrors}
                        ></input>

                        <input
                            className="input-long"
                            type="text"
                            name="ingredients"
                            ref={ingredientsRef}
                            placeholder="ingredients"
                            onKeyUp={inputIngredient}
                        ></input>

                        <input
                            className="input-long"
                            type="text"
                            name="directions"
                            ref={directionsRef}
                            placeholder="directions"
                            onKeyUp={inputDirection}
                        ></input>
                        <div className="input-oneline">
                            <select
                                className="input-small"
                                name="category"
                                id="recipe-category"
                                ref={categoryRef}
                            >
                                <option hidden>category</option>
                                <option value="main">main</option>
                                <option value="dessert">dessert</option>
                                <option value="starter">starter</option>
                            </select>

                            <select
                                className="input-small"
                                name="vegan"
                                id="recipe-vegan"
                                ref={veganRef}
                            >
                                <option hidden>vegan</option>
                                <option value="true">yes</option>
                                <option value="false">no</option>
                            </select>
                        </div>

                        <div className="input-oneline">
                            <input
                                className="input-small"
                                type="number"
                                name="servings"
                                ref={servingsRef}
                                placeholder="servings"
                            ></input>

                            <input
                                className="input-small"
                                type="number"
                                name="duration"
                                ref={durationRef}
                                placeholder="time (min)"
                            ></input>
                        </div>

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
                        UPLOAD
                    </button>
                    {errorMessage && (
                        <p className="error-create-recipe">{errorMessage}</p>
                    )}

                    <input
                        className="input-long scrape-url"
                        type="text"
                        name="directions"
                        ref={urlRef}
                        placeholder="url"
                        // onKeyUp={scrapeRecipe}
                    ></input>

                    <select
                        className="input-small scrape-category"
                        name="category"
                        ref={categoryScrapeRef}
                    >
                        <option hidden>category</option>
                        <option value="main">main</option>
                        <option value="dessert">dessert</option>
                        <option value="starter">starter</option>
                    </select>

                    <button
                        className="recipe-input-button scrape"
                        onClick={scrapeRecipe}
                    >
                        GET
                    </button>
                </div>

                <div className="recipe-added-element">
                    {ingredients && (
                        <>
                            <h1>INGREDIENTS</h1>
                            <ul className="ingredient-added">
                                {ingredients.map((ingredient, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => deleteIngredient(idx)}
                                    >
                                        <span className="material-symbols-outlined">
                                            check_box_outline_blank
                                        </span>{" "}
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <div className="recipe-added-element">
                    {directions && (
                        <>
                            <h1>DIRECTIONS</h1>
                            <ul className="direction-added">
                                {directions.map((direction, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => deleteDirection(idx)}
                                    >
                                        <span className="material-symbols-outlined">
                                            check_box_outline_blank
                                        </span>{" "}
                                        {direction}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default CreateRecipe;
