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
                    location.href = "/";
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
            <h1>menu</h1>
            {menu.length > 0 && (
                <>
                    <div className="menu-list">
                        {menu.map((recipe, idx) => (
                            <div key={recipe.id}>
                                <div key={idx}>
                                    <h2 key={recipe.id}>{recipe.title}</h2>
                                    <h3> ingredients</h3>
                                    <ul>
                                        {recipe.ingredients.map(
                                            (ingredient, idx) => (
                                                <li key={idx}>{ingredient}</li>
                                            )
                                        )}
                                    </ul>
                                    <h3> steps</h3>
                                    <ul>
                                        {recipe.directions.map(
                                            (direction, idx) => (
                                                <li key={idx}>{direction}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <Link
                                    to={`/recipe/${recipe.recipe_id}`}
                                    className="link-circle"
                                    id="link-recipe"
                                >
                                    <span className="material-symbols-outlined">
                                        arrow_forward
                                    </span>
                                </Link>
                                <div
                                    className="link-circle"
                                    onClick={() => deleteRecipe(recipe.id)}
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link to="/" className="link-circle" id="link-home">
                        <span className="material-symbols-outlined">home</span>
                    </Link>

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

            {menu.length == 0 && (
                <>
                    <h2>you have no items!</h2>
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Menu;
