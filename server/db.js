/* eslint-disable no-unused-vars */

const bcrypt = require("bcryptjs");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - local / heroku databases

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

const spicedPg = require("spiced-pg");
const db = spicedPg(dbUrl);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets

let sessionSecret;

if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("./secrets.json").SESSION_SECRET;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT info on tables

// insert USER

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

// insert RECIPE

module.exports.insertRecipe = (
    id,
    title,
    category,
    ingredients,
    directions,
    servings,
    vegan,
    subcategory,
    duration,
    notes
) => {
    return db.query(
        `INSERT INTO recipes(creator, title, category, ingredients, directions, servings, vegan, subcategory, duration, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
            id,
            title,
            category,
            ingredients,
            directions,
            servings || null,
            vegan,
            subcategory || null,
            duration || null,
            notes || null,
        ]
    );
};

// insert PICTURE

module.exports.insertPictureIntoRecipe = (picture, recipeid) => {
    return db.query(
        `UPDATE recipes SET picture = $1 WHERE id = $2 RETURNING *`,
        [picture, recipeid]
    );
};

// update RECIPE

module.exports.updateRecipe = (
    title,
    category,
    ingredients,
    directions,
    servings,
    vegan,
    subcategory,
    duration,
    notes,
    recipeid
) => {
    return db.query(
        `UPDATE recipes SET title = $1, category = $2, ingredients = $3, directions = $4, servings = $5, vegan = $6, subcategory = $7, duration = $8, notes = $9 WHERE id = $10 RETURNING *`,
        [
            title,
            category,
            ingredients,
            directions,
            servings || null,
            vegan,
            subcategory || null,
            duration || null,
            notes || null,
            recipeid,
        ]
    );
};

// delete RECIPE

module.exports.deleteRecipe = (recipeid) => {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [recipeid]);
};

// set FAVORITE

module.exports.setFavorite = (recipeid, favornot) => {
    return db.query(`UPDATE recipes SET favorite = $2 WHERE id = $1`, [
        recipeid,
        favornot,
    ]);
};

// insert MENU

module.exports.insertIntoMenu = (userid, recipeid) => {
    return db.query(`INSERT INTO menu(creator, recipe_id) VALUES ($1, $2)`, [
        userid,
        recipeid,
    ]);
};

// delete MENU

module.exports.deleteMenu = (userid) => {
    return db.query(`DELETE FROM menu WHERE creator = $1`, [userid]);
};

// delete RECIPE

module.exports.deleteMenuRecipe = (recipeid) => {
    return db.query(`DELETE FROM menu WHERE id = $1`, [recipeid]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET info from tables

// LOGIN > check USER

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

// LOGIN > check USER

module.exports.getUserInfoById = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// GET ALL RECIPES > from USER

module.exports.getUserRecipes = (id) => {
    return db.query(`SELECT * FROM recipes WHERE creator = $1`, [id]);
};

// GET ALL RECIPES > from USER > same category

module.exports.getRecipesByCategory = (id, category) => {
    return db.query(
        `SELECT * FROM recipes WHERE creator = $1 AND category = $2`,
        [id, category]
    );
};

// GET ALL RECIPES > from USER > same category > with FILTERS

module.exports.getRecipesByCategoryFiltered = (
    id,
    category,
    favorite,
    vegan
) => {
    return db.query(
        `SELECT * FROM recipes WHERE creator = $1 AND category = $2 AND favorite = $3 AND vegan = $4 `,
        [id, category, favorite, vegan]
    );
};

module.exports.getRecipeById = (id) => {
    return db.query(`SELECT * FROM recipes WHERE id = $1`, [id]);
};

// get MENU

module.exports.getMenu = (userid) => {
    return db.query(
        `SELECT title, ingredients, directions, picture, recipe_id, menu.id FROM menu JOIN recipes ON (recipe_id=recipes.id AND menu.creator = $1)`,
        [userid]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - for the INGREDIENT SEARCH

// ONE INGREDIENT
// SELECT * FROM recipes WHERE 'blabla'=ANY(ingredients); // 'value' = ANY (array)

// MORE THAN ONE
// SELECT * FROM recipes WHERE ingredients @> '{"blabla", "bla"}';

// if not working, then check:
// https://www.compose.com/articles/take-a-dip-into-postgresql-arrays/
// -- to create an INDEX (GIN Index) for the ingredients array:
// CREATE INDEX idx_ingredients ON recipes USING GIN(ingredients);
// -- to search the recipes which include one specific ingredient:
// SELECT title FROM recipes WHERE ingredients @> 'blabla';  // @> is "contain"
