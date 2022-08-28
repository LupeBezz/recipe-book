/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Login component

function Login() {
    const [errorMessage, setErrorMessage] = useState();

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleLogin = (e) => {
        e.preventDefault();

        const userData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        fetch("/api/login", {
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
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    };

    const clearErrors = () => {
        setErrorMessage("");
    };

    const clearFields = () => {
        emailRef.current.value = "";
        passwordRef.current.value = "";
    };

    return (
        <div className="reg-login-page">
            <img id="logo-startpage" src="/logo.jpg" />
            <h1 id="title-startpage">RECIPE BOOK</h1>
            <form className="reg-login-form" method="post">
                <input
                    type="email"
                    ref={emailRef}
                    placeholder="Email"
                    onClick={clearErrors}
                ></input>

                <input
                    type="password"
                    ref={passwordRef}
                    placeholder="Password"
                ></input>

                <input
                    className="reg-login-button"
                    type="submit"
                    value="LOGIN"
                    onClick={handleLogin}
                ></input>
            </form>

            <div>
                <p className="reg-login-sentence">
                    No account yet?{" > "}
                    <Link to="/" className="reg-login-link">
                        REGISTER
                    </Link>
                </p>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Login;
