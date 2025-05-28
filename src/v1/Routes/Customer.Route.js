const express = require("express");
const router = express.Router();
const { CustomerController } = require("../Controller/index");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const { AuthController } = require("../Controller");
const { PermissonCheck } = require("../Permisson/index");
const { Logger } = require("../Logger/index");
const fs = require("fs");
require("dotenv").config();
const dotenv = require("dotenv");
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

router.post(
    "/customer-list",PermissonCheck.verifyToken,Logger.Logreq,
    CustomerController.showcustomer,Logger.Logres
  );
  
  router.post(
    "/lead-list",PermissonCheck.verifyToken,Logger.Logreq,
    CustomerController.showlead,Logger.Logres
  );
  router.get(
    "/customer-search",PermissonCheck.verifyToken,Logger.Logreq,
    CustomerController.searchcustomer,Logger.Logres
  );
  router.post(
    "/customer-edit", uploadCustomer.any(),PermissonCheck.verifyToken,Logger.Logreq,
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
        } else if (file.fieldname == "NomineePhoto") {
          const params = {
            Bucket: BUCKET_NAME,
            Key: `Customer/NomineeProfilePhoto/${req.body.PhoneNumber}.jpg`,
            Body: file.buffer,
            ACL: "public-read", // Change the ACL according to your requirement
          };
          return s3.upload(params).promise();
        } else if (file.fieldname == "NomineeIdProofPhoto") {
          const params = {
            Bucket: BUCKET_NAME,
            Key: `Customer/NomineeIdProof/${req.body.PhoneNumber}.jpg`,
            Body: file.buffer,
            ACL: "public-read", // Change the ACL according to your requirement
          };
          return s3.upload(params).promise();
        } else if (file.fieldname == "Nomineesignature") {
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
    CustomerController.updatecustomer,Logger.Logres
  );

  router.post(
    "/customer-approve",Logger.Logreq,
    CustomerController.approvecustomer,Logger.Logres
  );

  router.post(
    "/customer-dropdown",PermissonCheck.verifyToken,Logger.Logreq,
    CustomerController.dropdowncustomer,Logger.Logres
  ); 
  router.post(
    "/scheme-dropdown",PermissonCheck.verifyToken,Logger.Logreq,
    CustomerController.dropdownscheme,Logger.Logres
);
router.post("/cust-detail-payment",PermissonCheck.verifyToken,Logger.Logreq, CustomerController.custdetailpayment,Logger.Logres);
router.post("/monthly-payment",PermissonCheck.verifyToken,Logger.Logreq, CustomerController.monthlypayment,Logger.Logres);
router.post("/wallet-balance",PermissonCheck.verifyToken,Logger.Logreq, CustomerController.walletbalance,Logger.Logres);
router.post("/tot-collection",Logger.Logreq, CustomerController.totcollection,Logger.Logres);
router.post(
  "/agent_transfer",
  Logger.Logreq,
  CustomerController.agenttransfer,
  Logger.Logres
);
 // module.exports = router;
module.exports=router;