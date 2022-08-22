/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component

function Registration() {
    // const [email, setEmail] = useState();
    // const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState();

    const firstRef = useRef();
    const lastRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleRegistration = (e) => {
        e.preventDefault();
        setErrorMessage("");
        console.log(firstRef.current.value);
        console.log(lastRef.current.value);
        console.log(emailRef.current.value);
        console.log(passwordRef.current.value);

        const userData = {
            first: firstRef.current.value,
            last: lastRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        //console.log("userData: ", userData);
        fetch("/api/registration", {
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
                    firstRef.current.value = "";
                    lastRef.current.value = "";
                    emailRef.current.value = "";
                    passwordRef.current.value = "";
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

    return (
        <div className="reg-login-page">
            <form className="reg-login-form" method="post">
                <input
                    type="text"
                    ref={firstRef}
                    placeholder="First name"
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
                    value="login"
                    onClick={handleRegistration}
                ></input>
            </form>

            <div>
                <p>
                    Already a member?{" > "}
                    <Link to="/login" id="link">
                        login
                    </Link>
                </p>
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Registration;
