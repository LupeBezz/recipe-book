/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component

class Login extends Component {
    constructor() {
        super(); //calls the constructor of the parent class. Used to access some variables in the parent

        this.state = {
            email: "",
            password: "",
            errorMessage: "",
            error: false,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    // we see when info is being entered in the input field
    onFormInputChange(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: target.value });
        console.log("this.setState: ", this.setState);
    }

    //test

    // when submitting the form
    onFormSubmit(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        fetch("/login.json", {
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
                    this.setState({ errorMessage: data.message });
                } else {
                    location.href = "/";
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    }
    render() {
        return (
            <div id="loginPage">
                <form
                    className="reg-login-form"
                    method="post"
                    action="/login.json"
                    onSubmit={this.onFormSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.onFormInputChange}
                    ></input>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onFormInputChange}
                    ></input>

                    <input
                        className="reg-login-button"
                        type="submit"
                        value="login"
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

                {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )}
            </div>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Login;
