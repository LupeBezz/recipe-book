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
                    value="login"
                    onClick={handleLogin}
                ></input>
            </form>

            <div>
                <p>
                    No account yet?{" > "}
                    <Link to="/" id="link">
                        register
                    </Link>
                </p>
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Login;
