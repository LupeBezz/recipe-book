/* eslint-disable no-unused-vars */

const path = require("path");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - install multer and uidSafe

// Multer is a node.js middleware for handling multipart/form-data, primarily used for uploading files
// uidSafe is a node.js middleware for creating cryptographically secure UIDs (unique identifiers) > we use it to create a unique name for each uploaded file

const multer = require("multer");
const uidSafe = require("uid-safe");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function to upload files

// destination is the place where we store the newly updated files > in the uploads folder
// filename is the name we give to each uploaded file > created with uidSafe

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
