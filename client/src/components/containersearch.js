/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import Preview from "./preview";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the ContainerSearch component

function ContainerSearch() {
    const { category } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [favorite, setFavorite] = useState();
    const [vegan, setVegan] = useState();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [veganRecipes, setVeganRecipes] = useState([]);
    const [preview, setPreview] = useState(false);
    const [clickedrecipe, setClickedRecipe] = useState();

    useEffect(() => {
        fetch(`/api/recipes-user/${category}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                // console.log("success in fetch after getLastUSers");
                setRecipes(data);
            })
            .catch((error) => {
                console.log("error on fetch getRecipesByCategory: ", error);
            });
    }, []);

    const openPreview = (id) => {
        if (preview == false) {
            setPreview(true);
            setClickedRecipe(id);
            console.log("id: ", id);
        } else {
            setPreview(false);
        }
    };

    const getAllRecipes = () => {
        setFavorite();
        setVegan();
        setFilteredRecipes([]);
        fetch(`/api/recipes-user/${category}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                // console.log("success in fetch after getLastUSers");
                setRecipes(data);
            })
            .catch((error) => {
                console.log("error on fetch getRecipesByCategory: ", error);
            });
    };

    const toggleFavorite = () => {
        //console.log("fav:", favorite);
        if (!favorite) {
            setFavorite(true);
        } else if (favorite == true) {
            setFavorite();
        }
    };

    const toggleVegan = () => {
        //console.log("vegan:", vegan);
        if (!vegan) {
            setVegan(true);
        } else if (vegan == true) {
            setVegan();
        }
    };

    const filterSearch = () => {
        console.log("fav:", favorite);
        console.log("vegan:", vegan);
        if (favorite && !vegan) {
            fetch(`/api/recipes-user-fav/${category}/${favorite}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("data: ", data);
                    // console.log("success in fetch after getRecipesByCategoryFiltered");
                    setFilteredRecipes(data);
                    setRecipes([]);
                })
                .catch((error) => {
                    console.log(
                        "error on fetch getRecipesByCategoryFavFiltered: ",
                        error
                    );
                });
        } else if (vegan && !favorite) {
            fetch(`/api/recipes-user-veg/${category}/${vegan}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("data: ", data);
                    // console.log("success in fetch after getRecipesByCategoryFiltered");
                    setFilteredRecipes(data);
                    setRecipes([]);
                })
                .catch((error) => {
                    console.log(
                        "error on fetch getRecipesByCategoryVegFiltered: ",
                        error
                    );
                });
        } else if (favorite && vegan) {
            console.log("favorite:", favorite);
            console.log("vegan:", vegan);
            fetch(`/api/recipes-user/${category}/${favorite}/${vegan}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("data: ", data);
                    // console.log("success in fetch after getRecipesByCategoryFiltered");
                    setFilteredRecipes(data);
                    setRecipes([]);
                })
                .catch((error) => {
                    console.log(
                        "error on fetch getRecipesByCategoryFiltered: ",
                        error
                    );
                });
        }
    };

    return (
        <>
            <div className="icons-container">
                <Link to="/" className="link-circle" id="link-home">
                    <span className="material-symbols-outlined">home</span>
                </Link>

                <div className="link-circle" onClick={getAllRecipes}>
                    <span className="material-symbols-outlined">
                        import_contacts
                    </span>
                </div>
                <div className="link-circle" onClick={toggleFavorite}>
                    <span className="material-symbols-outlined">favorite</span>
                </div>
                <div className="link-circle" onClick={toggleVegan}>
                    <span className="material-symbols-outlined">
                        nest_eco_leaf
                    </span>
                </div>
                <div className="link-circle" onClick={filterSearch}>
                    <span className="material-symbols-outlined">search</span>
                </div>
            </div>

            {category == "starter" && (
                <img id="starter-bgr" src="/starter_bgr.svg" />
            )}
            {category == "main" && <img id="main-bgr" src="/main_bgr.svg" />}
            {category == "dessert" && (
                <img id="dessert-bgr" src="/dessert_bgr.svg" />
            )}

            <div className="recipes-middle-line"></div>

            <div className="recipes-search">
                <h1>{category.toUpperCase()}</h1>

                {favorite == true && (
                    <span className="material-symbols-outlined">favorite</span>
                )}

                {vegan == true && (
                    <span className="material-symbols-outlined">
                        nest_eco_leaf
                    </span>
                )}

                {recipes.length > 0 && filteredRecipes.length == 0 && (
                    <>
                        <ul className="recipe-list">
                            {recipes.map((recipe, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => openPreview(recipe.id)}
                                >
                                    {recipe.title}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {recipes.length == 0 && filteredRecipes.length == 0 && (
                    <>
                        <p>no recipes found</p>
                    </>
                )}

                {filteredRecipes.length > 0 && (
                    <>
                        <ul className="recipe-list">
                            {filteredRecipes.map((recipe, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => openPreview(recipe.id)}
                                >
                                    {recipe.title}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {preview && (
                <>
                    <Preview clickedrecipe={clickedrecipe} />
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ContainerSearch;
