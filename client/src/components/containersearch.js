/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import Search from "./search";
import Preview from "./preview";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the ContainerSearch component

function ContainerSearch() {
    const { category } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [favorite, setFavorite] = useState(false);
    const [vegan, setVegan] = useState(false);
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

    // useEffect(() => {
    //     console.log("clickedrecipe inside useEffect:", clickedrecipe);
    // }, [clickedrecipe]);

    const openPreview = (id) => {
        if (preview == false) {
            setPreview(true);
            setClickedRecipe(id);
            console.log("id: ", id);
        } else {
            setPreview(false);
        }
    };

    const toggleFavorite = () => {
        //console.log("fav:", favorite);
        if (favorite == false) {
            setFavorite(true);
        } else {
            setFavorite(false);
        }
    };

    const toggleVegan = () => {
        //console.log("vegan:", vegan);
        if (vegan == false) {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    const filterSearch = () => {
        console.log("favorite:", favorite);
        console.log("vegan:", vegan);
        fetch(`/api/recipes-user/${category}/${favorite}/${vegan}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                // console.log("success in fetch after getRecipesByCategoryFiltered");
                setFilteredRecipes(data);
            })
            .catch((error) => {
                console.log(
                    "error on fetch getRecipesByCategoryFiltered: ",
                    error
                );
            });
    };

    return (
        <>
            <div className="icons-container">
                <Link to="/" className="link-circle" id="link-home">
                    <span className="material-symbols-outlined">home</span>
                </Link>

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
            <div id="shape-background" className={category}>
                <h1>container search: {category}</h1>
                {recipes.length > 0 && filteredRecipes.length == 0 && (
                    <>
                        <h1>recipe titles</h1>
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

                {filteredRecipes.length > 0 && (
                    <>
                        <h1>recipe titles</h1>
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

                <Search />
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
