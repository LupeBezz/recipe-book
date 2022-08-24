/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Stuff

const express = require("express");
const app = express();
const server = require("http").Server(app);

const path = require("path");

const compression = require("compression");
app.use(compression());

const bcrypt = require("bcryptjs");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const cryptoRandomString = require("crypto-random-string");

// const ses = require("./ses");
// const s3 = require("./s3");
// const uploader = require("./middleware").uploader;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require database

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder and uploads

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - cookie session

const cookieSession = require("cookie-session");

const SESSION_SECRET =
    process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET;

const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > registration

app.post("/api/registration", (req, res) => {
    console.log("fetch > req.body.first: ", req.body.first);
    console.log("fetch > req.body.last: ", req.body.last);
    console.log("fetch > req.body.email: ", req.body.email);
    console.log("fetch > req.body.password: ", req.body.password);
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check if all required info is provided
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({ success: false, message: "All fields are necessary" });
    }
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check for a valid email
    if (!req.body.email.includes("@")) {
        res.json({ success: false, message: "Please insert a valid email" });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize info
        req.body.email = req.body.email.toLowerCase();
        req.body.first =
            req.body.first.charAt(0).toUpperCase() +
            req.body.first.slice(1).toLowerCase();
        req.body.last =
            req.body.last.charAt(0).toUpperCase() +
            req.body.last.slice(1).toLowerCase();
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - add User
        db.insertUser(
            req.body.first,
            req.body.last,
            req.body.email,
            req.body.password
        )
            .then((results) => {
                console.log("insertUser worked!");
                //console.log("results.rows[0]: ", results.rows[0]);
                // - - - - - - - - - - - - - - - - - - - - store id in cookie
                var userId = results.rows[0].id;
                req.session = { userId };
                //res.send(`loginId: ${req.session.loginId}`);
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in insertUser", err);
                res.json({
                    success: false,
                    message: "oops, something went wrong!",
                });
            });
        console.log("post request to /registration works");
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > login

app.post("/api/login", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, message: "All fields are necessary" });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize info

        req.body.email = req.body.email.toLowerCase();
        console.log("fetch > req.body.email: ", req.body.email);
        console.log("fetch > req.body.password: ", req.body.password);

        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check User

        db.getUserInfo(req.body.email)
            .then((results) => {
                console.log("results: ", results);
                if (results.rows.length === 0) {
                    console.log("Error in getUserInfo: email not found");
                    res.json({
                        success: false,
                        message: "oops, something went wrong!",
                    });
                } else {
                    console.log("Success in getUserInfo: email found");

                    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check password

                    let inputPassword = req.body.password;
                    let databasePassword = results.rows[0].password;

                    return bcrypt
                        .compare(inputPassword, databasePassword)
                        .then((result) => {
                            //console.log(result);
                            if (result) {
                                console.log("Success in Password Comparison");

                                // - - - - - - - - - - - - - - - - - - - - store id in cookie
                                var userId = results.rows[0].id;
                                req.session = { userId };
                                //res.send(`loginId: ${req.session.loginId}`);

                                res.json({
                                    success: true,
                                });
                            } else {
                                console.log("Error in Password Comparison");
                                res.json({
                                    success: false,
                                    message: "oops, something went wrong!",
                                });
                            }
                        })
                        .catch((error) => {
                            console.log("Error in Password Comparison", error);
                            res.json({
                                success: false,
                                message:
                                    "Something went wrong, please try again",
                            });
                        });
                }
            })
            .catch((err) => {
                console.log("error in getUserInfo", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > upload profile picture

// app.post(
//     "/api/upload-picture",
//     uploader.single("uploadPicture"),
//     s3.upload,
//     (req, res) => {
//         //console.log("inside post -upload.json");
//         //console.log("req.body inside post-upload: ", req.body);
//         //console.log("req.file inside post-upload:", req.file);
//         if (!req.file) {
//             res.json({ message: "please select a file" });
//         }
//         let fullUrl =
//             "https://s3.amazonaws.com/spicedling/" + req.file.filename;

//         db.insertUserPicture(req.session.userId, fullUrl)
//             .then((results) => {
//                 //console.log("insertImage worked!");
//                 //console.log("results:", results);
//                 res.json({ fullUrl, message: "oops, something went wrong" });
//             })
//             .catch((err) => {
//                 console.log("error in insertUserPicture", err);
//             });
//     }
// );

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > get user info

app.get("/api/user-info", (req, res) => {
    db.getUserInfoById(req.session.userId)
        .then((results) => {
            //console.log("results: ", results);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getUserInfoById", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > insert recipe

app.post("/api/recipe-upload", (req, res) => {
    console.log("req.body: ", req.body);
    if (
        !req.body.title ||
        !req.body.category ||
        !req.body.ingredients ||
        !req.body.directions
    ) {
        res.json({
            success: false,
            message: "Please complete the obligatory fields",
        });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize info

        req.body.title = req.body.title.toLowerCase();

        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - insert Recipe

        db.insertRecipe(
            req.session.userId,
            req.body.title,
            req.body.category,
            req.body.ingredients,
            req.body.directions,
            req.body.description,
            req.body.picture,
            req.body.servings,
            req.body.difficulty,
            req.body.vegetarian,
            req.body.vegan,
            req.body.subcategory,
            req.body.rating,
            req.body.duration,
            req.body.notes
        )
            .then((results) => {
                console.log("results: ", results);
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("error in insertRecipe", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > get recipes from user

app.get("/api/recipes-user", (req, res) => {
    db.getUserRecipes(req.session.userId)
        .then((results) => {
            console.log("results: ", results);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getUserRecipes", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > get recipes by user and category

app.get("/api/recipes-user/:category", (req, res) => {
    db.getRecipesByCategory(req.session.userId, req.params.category)
        .then((results) => {
            console.log("results: ", results);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getRecipesByCategory", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > get recipe by id

app.get("/api/recipe-preview/:id", (req, res) => {
    db.getRecipeById(req.params.id)
        .then((results) => {
            console.log("results after getRecipesById: ", results);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getRecipesById", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - logout button

app.get("/api/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check if user is logged in

app.get("/api/check/userId", function (req, res) {
    res.json({ userId: req.session.userId });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve html > position fixed

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 3001;

server.listen(process.env.PORT || PORT, function () {
    console.log("I'm listening.");
});
