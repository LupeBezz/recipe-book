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
    const [preview, setPreview] = useState(false);
    const [clickedrecipe, setClickedRecipe] = useState();

    useEffect(() => {
        fetch(`/api/recipes-user/${category}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log("data: ", data);
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

    return (
        <>
            <div>
                <h1>container search: {category}</h1>
                {recipes.length > 0 && (
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

                <Search />
            </div>

            {preview && (
                <>
                    <Preview clickedrecipe={clickedrecipe} />
                </>
            )}

            <Link to="/" className="link-circle" id="link-home">
                home
            </Link>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ContainerSearch;
