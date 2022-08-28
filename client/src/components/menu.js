/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Menu component

function Menu() {
    const [errorMessage, setErrorMessage] = useState();
    const [menu, setMenu] = useState("");

    useEffect(() => {
        //console.log("props.clickedrecipe in useEffect: ", props.clickedrecipe);
        fetch("/api/menu")
            .then((response) => response.json())
            .then((data) => {
                console.log("data after getMenu: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    setMenu(data);
                }
            })
            .catch((error) => {
                console.log("error on fetch after getMenu: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    }, []);

    const deleteMenu = () => {
        console.log("deleting menu!");
        fetch("/api/menu-delete")
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    location.href = "/menu";
                }
            })
            .catch((error) => {
                console.log("error on fetch after deleteMenu: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    const deleteRecipe = (id) => {
        console.log("deleting recipe! id: ", id);
        fetch(`/api/menu-recipe-delete/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                } else {
                    setMenu([...menu].filter((recipe) => recipe.id !== id));
                }
            })
            .catch((error) => {
                console.log("error on fetch after deleteMenuRecipe: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    return (
        <>
            <div className="icons-container">
                <Link to="/" className="link-circle" id="link-home">
                    <span className="material-symbols-outlined">home</span>
                </Link>
                {menu.length > 0 && (
                    <>
                        <Link
                            to="/menu/groceries"
                            className="link-circle"
                            id="link-groceries"
                        >
                            <span className="material-symbols-outlined">
                                shopping_bag
                            </span>
                        </Link>
                        <div className="link-circle" onClick={deleteMenu}>
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                        </div>
                    </>
                )}
            </div>
            <div id="menu-preview-all">
                {menu.length > 0 && (
                    <>
                        {menu.map((recipe, idx) => (
                            <div className="menu-preview" key={recipe.id}>
                                <h2 key={recipe.id}>
                                    {recipe.title.toUpperCase()}
                                </h2>
                                <Link
                                    to={`/recipe/${recipe.recipe_id}`}
                                    id="link-directions"
                                >
                                    <img
                                        src={
                                            recipe.picture ||
                                            "/recipe_default.jpg"
                                        }
                                    />
                                </Link>

                                <ul className="ingredients-list">
                                    {recipe.ingredients.map(
                                        (ingredient, idx) => (
                                            <li key={idx}>{ingredient}</li>
                                        )
                                    )}
                                </ul>

                                <div id="menu-icons-div">
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

                                <div
                                    className="link-circle delete-button-menu"
                                    onClick={() => deleteRecipe(recipe.id)}
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {menu.length == 0 && (
                <div id="menu-page">
                    <h2 id="menu-empty">
                        YOU HAVE NO RECIPES SAVED ON THE MENU
                    </h2>
                </div>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Menu;
