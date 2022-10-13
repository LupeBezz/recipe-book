/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - create servers

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - application server (express)

const express = require("express");
const app = express();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - web server (node)

const server = require("http").Server(app);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// recipe scraper
const recipeScraper = require("recipe-scraper");

// to work with file and directory paths
const path = require("path");

// to compress response bodies for all requests
const compression = require("compression");
app.use(compression());

// to hash passwords
const bcrypt = require("bcryptjs");

// to parse cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// to parse the request bodies in forms and make the info available as req.body
app.use(express.urlencoded({ extended: false }));

// to unpack JSON in the request body
app.use(express.json());

// to generate a cryptographically strong random string
const cryptoRandomString = require("crypto-random-string");

// (aws) to upload files to aws
const s3 = require("./s3");

// to store files in the local server
const uploader = require("./middleware").uploader;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require our database

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder and uploads

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - cookie session middleware

const cookieSession = require("cookie-session");

const SESSION_SECRET =
    process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET;

const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitizing functions

const sanitizeEmail = (email) => {
    return email.toLowerCase();
};

const sanitizeName = (name) => {
    var sanitizedName =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return sanitizedName;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - routes

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REGISTER

app.post("/api/registration", (req, res) => {
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({ success: false, message: "All fields are necessary" });
    }
    if (!req.body.email.includes("@")) {
        res.json({ success: false, message: "Please insert a valid email" });
    } else {
        db.insertUser(
            sanitizeName(req.body.first),
            sanitizeName(req.body.last),
            sanitizeEmail(req.body.email),
            req.body.password
        )
            .then((results) => {
                // store id in cookie
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
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - LOGIN

app.post("/api/login", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, message: "All fields are necessary" });
    } else {
        db.getUserInfo(sanitizeEmail(req.body.email))
            .then((results) => {
                if (results.rows.length === 0) {
                    console.log("Error in getUserInfo: email not found");
                    res.json({
                        success: false,
                        message: "oops, something went wrong!",
                    });
                } else {
                    let inputPassword = req.body.password;
                    let databasePassword = results.rows[0].password;

                    return bcrypt
                        .compare(inputPassword, databasePassword)
                        .then((result) => {
                            if (result) {
                                // store id in cookie
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET USER INFO

app.get("/api/user-info", (req, res) => {
    db.getUserInfoById(req.session.userId)
        .then((results) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SCRAPE RECIPES

app.post("/api/recipe-scrape", (req, res) => {
    recipeScraper(req.body.url)
        .then((recipe) => {
            db.scrapeRecipe(
                req.session.userId,
                recipe.name,
                req.body.category,
                recipe.ingredients,
                recipe.instructions,
                recipe.image,
                null,
                false,
                null,
                req.body.url
            )
                .then((results) => {
                    res.json(results.rows[0]);
                })
                .catch((err) => {
                    console.log("error after insertRecipe", err);
                    res.json({
                        success: false,
                        message: "Something went wrong, please try again",
                    });
                });
        })
        .catch((error) => {
            console.log("error in scraping :", error);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT RECIPE

app.post("/api/recipe-upload", (req, res) => {
    if (
        !req.body.title ||
        !req.body.category ||
        !req.body.ingredients ||
        !req.body.directions
    ) {
        res.json({
            success: false,
            message: "The first four fields are obbligatory",
        });
    } else {
        db.insertRecipe(
            req.session.userId,
            req.body.title.toLowerCase(),
            req.body.category,
            req.body.ingredients,
            req.body.directions,
            req.body.servings,
            req.body.vegan,
            req.body.duration
        )
            .then((results) => {
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("error after insertRecipe", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UPLOAD PICTURE

app.post(
    "/api/picture-upload",
    uploader.single("picture"),
    s3.upload,
    (req, res) => {
        let fullUrl =
            "https://s3.amazonaws.com/spicedling/" + req.file.filename;

        db.insertPictureIntoRecipe(fullUrl, req.body.id)
            .then((results) => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in insertPicture", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UPDATE RECIPE

app.post("/api/recipe-update", (req, res) => {
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
        db.updateRecipe(
            req.body.title.toLowerCase(),
            req.body.category,
            req.body.ingredients,
            req.body.directions,
            req.body.servings,
            req.body.vegan,
            req.body.duration,
            req.body.id
        )
            .then((results) => {
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("error in updateRecipe", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DELETE RECIPE

app.get("/api/recipe-delete/:id", (req, res) => {
    db.deleteRecipe(req.params.id)
        .then((results) => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in deleteRecipe", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET ALL RECIPES

app.get("/api/recipes-user", (req, res) => {
    db.getUserRecipes(req.session.userId)
        .then((results) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FILTER RECIPES BY CATEGORY

app.get("/api/recipes-user/:category", (req, res) => {
    db.getRecipesByCategory(req.session.userId, req.params.category)
        .then((results) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FILTER RECIPES BY FAV OR VEGAN
app.get("/api/recipes-user/:category/:favorite/:vegan", (req, res) => {
    db.getRecipesByCategoryFiltered(
        req.session.userId,
        req.params.category,
        req.params.favorite,
        req.params.vegan
    )
        .then((results) => {
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

app.get("/api/recipes-user-fav/:category/:favorite/", (req, res) => {
    db.getRecipesByCategoryFavFiltered(
        req.session.userId,
        req.params.category,
        req.params.favorite
    )
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getRecipesByCategoryFavFiltered", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

app.get("/api/recipes-user-veg/:category/:vegan", (req, res) => {
    db.getRecipesByCategoryVegFiltered(
        req.session.userId,
        req.params.category,
        req.params.vegan
    )
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getRecipesByCategoryVegFiltered", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET RECIPE BY ID

app.get("/api/recipe-preview/:id", (req, res) => {
    db.getRecipeById(req.params.id)
        .then((results) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT MENU

app.post("/api/menu-insert/:id", (req, res) => {
    db.insertIntoMenu(req.session.userId, req.params.id)
        .then((results) => {
            res.json({
                success: true,
            });
        })
        .catch((err) => {
            console.log("error after insertIntoMenu", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET MENU

app.get("/api/menu", (req, res) => {
    db.getMenu(req.session.userId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getMenu", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DELETE MENU

app.get("/api/menu-delete", (req, res) => {
    db.deleteMenu(req.session.userId)
        .then((results) => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in deleteMenu", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DELETE RECIPE

app.get("/api/menu-recipe-delete/:id", (req, res) => {
    db.deleteMenuRecipe(req.params.id)
        .then((results) => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in deleteMenuRecipe", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SET FAVORITE

app.get("/api/recipe/favorite/:id/:favornot", (req, res) => {
    db.setFavorite(req.params.id, req.params.favornot)
        .then((results) => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in setFavorite", err);
            res.json({
                success: false,
                message: "Something went wrong, please try again",
            });
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CHECK FOR LOGIN

app.get("/api/check/userId", function (req, res) {
    res.json({ userId: req.session.userId });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - LOGOUT

app.get("/api/logout", (req, res) => {
    req.session.userId = null;
    // res.json({});
    res.redirect("/");
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SERVE HTML (always at the bottom)

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 3001;

server.listen(process.env.PORT || PORT, function () {
    console.log("I'm listening.");
});
