/* eslint-disable no-unused-vars */

const aws = require("aws-sdk");
const fs = require("fs");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets stuff

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - upload function that talks to AWS

exports.upload = (req, res, next) => {
    // if (!req.file) {
    //     return res.sendStatus(500);
    // }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - check req.file to understand what it is

    console.log("req.file:", req.file);

    const { filename, mimetype, size, path } = req.file;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - putObject method > what is returned is stored in the promise

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - what returns we store in the promise variable and handle it here:

    promise
        .then(() => {
            console.log("amazon upload successful");
            next();
        })
        .catch((err) => {
            console.log("error in upload put object: ", err);
            res.sendStatus(404);
        });
};
