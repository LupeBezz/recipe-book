/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// to work with file and directory paths
const path = require("path");

// to handle multipart/form-data > used for file upload
const multer = require("multer");

// to create cryptographically secure UIDs (unique identifiers) > to give a unique name for each uploaded file
const uidSafe = require("uid-safe");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - local server upload middleware

// function used in server.js to save profile pictures on the local server

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, callback) => {
        console.log("making file name");
        uidSafe(24).then((uid) => {
            const extension = path.extname(file.originalname);
            const newFileName = uid + extension;
            callback(null, newFileName); // null bacause no errors in this callback
        });
    },
});

module.exports.uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});
