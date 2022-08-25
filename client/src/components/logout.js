/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Logout component

function Logout() {
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetch("/api/logout")
            .then(() => {
                //console.log("success in fetch after logout");
                //console.log("data: ", data);
                location.href = "/";
            })
            .catch((error) => {
                console.log("error on fetch after logout ", error);
            });
    }, []);

    return <></>;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Logout;
