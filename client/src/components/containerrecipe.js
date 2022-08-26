/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import Preview from "./preview";
import Recipe from "./recipe";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the ContainerRecipe component

function ContainerRecipe() {
    const { id } = useParams();
    return (
        <>
            {id && (
                <>
                    <div>
                        <h1>container RECIPE</h1>
                        <Preview clickedrecipe={id} />
                        <Recipe clickedrecipe={id} />
                    </div>
                    <Link to="/" className="link-circle" id="link-home">
                        <span className="material-symbols-outlined">home</span>
                    </Link>
                </>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ContainerRecipe;
