/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - database info

let dbUrl;

if (process.env.NODE_ENV === "production") {
    dbUrl = process.env.DATABASE_URL;
} else {
    const {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
    } = require("./secrets.json");
    dbUrl = `postgres:${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// to hash passwords
const bcrypt = require("bcryptjs");

// to handle the database
const spicedPg = require("spiced-pg");
const db = spicedPg(dbUrl);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets middleware

let sessionSecret;

if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("./secrets.json").SESSION_SECRET;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - database functions

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT USER

function hashPassword(password) {
    return bcrypt
        .genSalt()
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .then((hashedPassword) => {
            return hashedPassword;
        });
}

module.exports.insertUser = (first, last, email, password) => {
    return hashPassword(password).then((hashedPassword) => {
        return db.query(
            `INSERT INTO users(first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
            [first, last, email, hashedPassword]
        );
    });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT RECIPE

module.exports.insertRecipe = (
    id,
    title,
    category,
    ingredients,
    directions,
    servings,
    vegan,
    duration
) => {
    return db.query(
        `INSERT INTO recipes(creator, title, category, ingredients, directions, servings, vegan, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
            id,
            title,
            category,
            ingredients,
            directions,
            servings || null,
            vegan,
            duration || null,
        ]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT PICTURE

module.exports.insertPictureIntoRecipe = (picture, recipeid) => {
    return db.query(
        `UPDATE recipes SET picture = $1 WHERE id = $2 RETURNING *`,
        [picture, recipeid]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SCRAPE RECIPE

module.exports.scrapeRecipe = (
    id,
    title,
    category,
    ingredients,
    directions,
    picture,
    servings,
    vegan,
    duration,
    url
) => {
    return db.query(
        `INSERT INTO recipes(creator, title, category, ingredients, directions, picture, servings, vegan, duration, url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
            id,
            title,
            category,
            ingredients,
            directions,
            picture || null,
            servings || null,
            vegan,
            duration || null,
            url,
        ]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UPDATE RECIPE

module.exports.updateRecipe = (
    title,
    category,
    ingredients,
    directions,
    servings,
    vegan,
    duration,
    recipeid
) => {
    return db.query(
        `UPDATE recipes SET title = $1, category = $2, ingredients = $3, directions = $4, servings = $5, vegan = $6, duration = $7 WHERE id = $8 RETURNING *`,
        [
            title,
            category,
            ingredients,
            directions,
            servings || null,
            vegan,
            duration || null,
            recipeid,
        ]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DELETE RECIPE

module.exports.deleteRecipe = (recipeid) => {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [recipeid]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SET FAV

module.exports.setFavorite = (recipeid, favornot) => {
    return db.query(`UPDATE recipes SET favorite = $2 WHERE id = $1`, [
        recipeid,
        favornot,
    ]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT MENU

module.exports.insertIntoMenu = (userid, recipeid) => {
    return db.query(`INSERT INTO menu(creator, recipe_id) VALUES ($1, $2)`, [
        userid,
        recipeid,
    ]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DELETE MENU

module.exports.deleteMenu = (userid) => {
    return db.query(`DELETE FROM menu WHERE creator = $1`, [userid]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DELETE RECIPE

module.exports.deleteMenuRecipe = (recipeid) => {
    return db.query(`DELETE FROM menu WHERE id = $1`, [recipeid]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - LOGIN

module.exports.getUserInfo = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports.updatePassword = (password, email) => {
    return hashPassword(password).then((hashedPassword) => {
        return db.query(`UPDATE users SET password =$1 WHERE email = $2`, [
            hashedPassword,
            email,
        ]);
    });
};

module.exports.getUserInfoById = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET ALL RECIPES

module.exports.getUserRecipes = (id) => {
    return db.query(`SELECT * FROM recipes WHERE creator = $1`, [id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET RECIPES BY CATEGORY

module.exports.getRecipesByCategory = (id, category) => {
    return db.query(
        `SELECT * FROM recipes WHERE creator = $1 AND category = $2 ORDER BY title ASC`,
        [id, category]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FILTER RECIPES

module.exports.getRecipesByCategoryFiltered = (
    id,
    category,
    favorite,
    vegan
) => {
    return db.query(
        `SELECT * FROM recipes WHERE creator = $1 AND category = $2 AND favorite = $3 AND vegan = $4 ORDER BY title ASC`,
        [id, category, favorite, vegan]
    );
};

module.exports.getRecipesByCategoryFavFiltered = (id, category, favorite) => {
    return db.query(
        `SELECT * FROM recipes WHERE creator = $1 AND category = $2 AND favorite = $3 ORDER BY title ASC`,
        [id, category, favorite]
    );
};

module.exports.getRecipesByCategoryVegFiltered = (id, category, vegan) => {
    return db.query(
        `SELECT * FROM recipes WHERE creator = $1 AND category = $2 AND vegan = $3 ORDER BY title ASC`,
        [id, category, vegan]
    );
};

module.exports.getRecipeById = (id) => {
    return db.query(`SELECT * FROM recipes WHERE id = $1`, [id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET MENU

module.exports.getMenu = (userid) => {
    return db.query(
        `SELECT title, ingredients, picture, favorite, servings, vegan, duration, recipe_id, menu.id FROM menu JOIN recipes ON (recipe_id=recipes.id AND menu.creator = $1)`,
        [userid]
    );
};
