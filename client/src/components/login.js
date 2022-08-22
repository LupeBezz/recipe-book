/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Login component

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState();

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(emailRef.current.value);
        console.log(passwordRef.current.value);
        // setEmail(emailRef.current.value);
        // setPassword(passwordRef.current.value);

        const userData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        //console.log("userData: ", userData);
        fetch("/api/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                //render error conditionally
                if (!data.success && data.message) {
                    setErrorMessage(data.message);
                    emailRef.current.value = "";
                    passwordRef.current.value = "";
                } else {
                    location.href = "/";
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    };

    return (
        <div className="reg-login-page">
            <form
                className="reg-login-form"
                method="post"
                // onSubmit={this.onFormSubmit}
            >
                <input ref={emailRef} placeholder="Email"></input>

                <input ref={passwordRef} placeholder="Password"></input>

                <input
                    className="reg-login-button"
                    type="submit"
                    value="login"
                    onClick={handleLogin}
                ></input>
            </form>

            <div>
                <p>
                    Forgot your password? {" > "}
                    <Link to="/resetpassword" id="link">
                        reset
                    </Link>
                </p>

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
