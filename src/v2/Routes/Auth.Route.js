const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const { AuthController } = require("../Controller");
const { PermissonCheck } = require("../Permisson/index");
const { Logger } = require("../Logger/index");
const fs = require("fs");
require("dotenv").config();
var baseurl = "F:/Bangashree/BangaSreeBackEnd/Images";
// var ID = "AKIAU6GDVOUTY4EORUEX";
// var SECRET = "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";

// The name of the bucket that you have created
// var BUCKET_NAME = "bangasreejewellers-images-upload.s3.ap-south-1.amazonaws.com";
const dotenv = require("dotenv");

// Specify the path to your .env file

require("dotenv").config({ path: "../../../.env" });
// const abc =require("../../../.env");
///env----------------------------------------
// var ID = process.env.ID;
// var SECRET = process.env.SECRET;
// var BUCKET_NAME = process.env.BUCKET_NAME;
//----------------------------------------------
var ID = "AKIAU6GDVOUTY4EORUEX";
var SECRET = "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";
var BUCKET_NAME = "images.bangasreejewellers.in";
console.log(SECRET, BUCKET_NAME, "s14");
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    // Set your region here
    LocationConstraint: "ap-south-1",
  },
};

// s3.createBucket(params, function(err, data) {
//   if (err) console.log(err, err.stack);
//   else console.log('Bucket Created Successfully', data.Location);
// });
//------------------------------agent---------------------------------------------------------
const multerConfigagent = multer.memoryStorage();
const uploadAgent = multer({
  storage: multerConfigagent,
  // Limits configuration to restrict file size and number of files
  limits: {
    fileSize: 10 * 1024 * 1024, // 2 MB (in bytes)
    files: 3, // Maximum 5 files
  },
});
//-----------------------------------------------------------------------------

//---------------------------------superuser---------------------------------------

const multerConfigsuperuser = multer.memoryStorage();
const uploadSuperuser = multer({
  storage: multerConfigsuperuser,
  // Limits configuration to restrict file size and number of files
  limits: {
    fileSize: 10 * 1024 * 1024, // 2 MB (in bytes)
    files: 3, // Maximum 5 files
  },
});
//---------------------------------------------------------------------------------

//----------------------------------customer------------------------------------------
const multerConfigcustomer = multer.memoryStorage();
const uploadCustomer = multer({
  storage: multerConfigcustomer,
  // Limits configuration to restrict file size and number of files
  limits: {
    fileSize: 10 * 1024 * 1024, // 2 MB (in bytes)
    files: 6, // Maximum 5 files
  },
});
//--------------------------------------------------------------------------------------

console.log("3");
router.post("/login", Logger.Logreq, AuthController.securelogin, Logger.Logres);
router.post("/token-generate", PermissonCheck.GenerateToken);

router.post(
  "/agent-registration",
  uploadAgent.any(),
  PermissonCheck.verifyToken,
  (req, res, next) => {
    // Upload files to S3.
    console.log(req.files, "check");
    const uploadPromises = req.files.map((file) => {
      console.log(SECRET, BUCKET_NAME, "d14");
      console.log(file.fieldname);
      if (file.fieldname == "Photo") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Agent/ProfilePhoto/${req.body.Phonenumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "IDProofPhoto") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Agent/IdProof/${req.body.Phonenumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "Signature") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Agent/Signature/${req.body.Phonenumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      }
    });

    // Wait for all uploads to finish
    Promise.all(uploadPromises)
      .then((uploadResponses) => {
        console.log("Files uploaded successfully:", uploadResponses);
        // Call next middleware or send response
        next();
      })
      .catch((err) => {
        console.error("Error uploading files to S3:", err);
        // Handle error
        res.status(500).json({ error: "Error uploading files to S3" });
      });
  },
  Logger.Logreq,
  AuthController.AgentRegistration,
  Logger.Logres
);
router.post(
  "/customer-registration",
  uploadCustomer.any(),
  PermissonCheck.verifyToken,
  (req, res, next) => {
    // Upload files to S3
    console.log(req.files, "check");
    const uploadPromises = req.files.map((file) => {
      console.log(SECRET, BUCKET_NAME, "d14");
      console.log(file.fieldname);
      if (file.fieldname == "AplicantPhoto") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/ProfilePhoto/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "IdProofPhoto") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/IdProof/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "Customersignature") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/Signature/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "NomineePhoto[]") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeProfilePhoto/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "NomineeIdProofPhoto[]") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeIdProof/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "Nomineesignature[]") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeSignature/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      }
    });

    // Wait for all uploads to finish
    Promise.all(uploadPromises)
      .then((uploadResponses) => {
        console.log("Files uploaded successfully:", uploadResponses);
        // Call next middleware or send response
        next();
      })
      .catch((err) => {
        console.error("Error uploading files to S3:", err);
        // Handle error
        res.status(500).json({ error: "Error uploading files to S3" });
      });
  },
  Logger.Logreq,
  AuthController.CustomerRegistration,
  Logger.Logres
);
router.post(
  "/lead-registration",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AuthController.LeadeRegistration,
  Logger.Logres
);

router.post(
  "/superuser-registration",
  uploadSuperuser.any(),
  Logger.Logreq,
  (req, res, next) => {
    // Upload files to S3
    console.log(req.files, req.body, "req files");
    const uploadPromises = req.files.map((file) => {
      console.log(SECRET, BUCKET_NAME, "d14");
      console.log(file.fieldname);
      if (file.fieldname == "Photo") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Superuser/ProfilePhoto/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "IdProofPic") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Superuser/IdProof/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "Signature") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Superuser/Signature/${req.body.PhoneNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      }
    });

    // Wait for all uploads to finish
    Promise.all(uploadPromises)
      .then((uploadResponses) => {
        console.log("Files uploaded successfully:", uploadResponses);
        // Call next middleware or send response
        res.locals.uploadResponses = uploadResponses;
        next();
      })
      .catch((err) => {
        console.error("Error uploading files to S3:", err);
        // Handle error
        res.status(500).json({ error: "Error uploading files to S3" });
      });
  },
  Logger.Logreq,
  AuthController.superuserRegistration,
  Logger.Logres
);

router.post(
  "/forget-password",
  Logger.Logreq,
  AuthController.forgetpass,
  Logger.Logres
);
router.post(
  "/reset-password",
  Logger.Logreq,
  AuthController.resetpass,
  Logger.Logres
);
router.post("/verify-token", PermissonCheck.verifyToken);

// router.post("/loginauthcontroller/loginservices/login",securelogin);
module.exports = router;
