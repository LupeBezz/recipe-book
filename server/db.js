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

// insert USER PIC

module.exports.insertUserPicture = (id, url) => {
    return db.query(`UPDATE users SET userpic=$2 WHERE id = $1`, [id, url]);
};

// insert RECIPE

module.exports.insertRecipe = (
    id,
    title,
    category,
    ingredients,
    directions,
    description,
    picture,
    servings,
    difficulty,
    vegetarian,
    vegan,
    subcategory,
    rating,
    duration,
    notes
) => {
    return db.query(
        `INSERT INTO recipes(creator, title, category, ingredients, directions, description, picture, servings, difficulty, vegetarian, vegan, subcategory, rating, duration, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [
            id,
            title,
            category,
            ingredients,
            directions,
            description,
            picture,
            servings,
            difficulty,
            vegetarian,
            vegan,
            subcategory,
            rating,
            duration,
            notes,
        ]
    );
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

module.exports.getRecipeById = (id) => {
    return db.query(`SELECT * FROM recipes WHERE id = $1`, [id]);
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
