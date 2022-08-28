/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component

function Registration() {
    const [errorMessage, setErrorMessage] = useState();

    const firstRef = useRef();
    const lastRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleRegistration = (e) => {
        clearErrors();

        const userData = {
            first: firstRef.current.value,
            last: lastRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        e.preventDefault();

        fetch("/api/registration", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log("data: ", data);
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                    clearFields();
                } else {
                    location.href = "/";
                    //history.push("/");
                }
            })
            .catch((error) => {
                console.log("error on fetch after handleRegistration: ", error);
                setErrorMessage("oops, something went wrong!");
            });
    };

    const clearErrors = () => {
        setErrorMessage("");
    };

    const clearFields = () => {
        firstRef.current.value = "";
        lastRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
    };

    return (
        <div className="reg-login-page">
            <img id="logo-startpage" src="/logo.jpg" />
            <h1 id="title-startpage">RECIPE BOOK</h1>
            <form className="reg-login-form" method="post">
                <input
                    type="text"
                    ref={firstRef}
                    placeholder="First name"
                    onClick={clearErrors}
                ></input>

                <input
                    type="text"
                    ref={lastRef}
                    placeholder="Last name"
                ></input>

                <input type="email" ref={emailRef} placeholder="Email"></input>

                <input
                    type="password"
                    ref={passwordRef}
                    placeholder="Password"
                ></input>

                <input
                    className="reg-login-button"
                    type="submit"
                    value="REGISTER"
                    onClick={handleRegistration}
                ></input>
            </form>

            <div>
                <p className="reg-login-sentence">
                    Already a member?{" > "}
                    <Link to="/login" className="reg-login-link">
                        LOGIN
                    </Link>
                </p>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Registration;
