const express = require("express");
const router = express.Router();
const { AgentController } = require("../Controller/index");
const { PermissonCheck } = require("../Permisson/index");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const { AuthController } = require("../Controller");
const { Logger } = require("../Logger/index");
const fs = require("fs");
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
//--
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
  "/agent-list",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.showagent,
  Logger.Logres
);

router.get(
  "/agent-search",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.searchagent,
  Logger.Logres
);
router.post(
  "/agentcode-list",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.showagentcode,
  Logger.Logres
);

router.post(
  "/agent-edit",
  uploadAgent.any(),
  PermissonCheck.verifyToken,
  Logger.Logreq,
  (req, res, next) => {
    // Upload files to S3.
    console.log(req.files, "check 0502025");
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
  AgentController.updateagent,
  Logger.Logres
);

router.post(
  "/agentByID",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.getAgentById,
  Logger.Logres
);

router.post(
  "/agent-approve",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.approveagent,
  Logger.Logres
);

router.post(
  "/customer-collection",
  Logger.Logreq,
  AgentController.customercollection,
  Logger.Logres
);

router.post(
  "/customer-collectionedit",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.customercollectionedit,
  Logger.Logres
);

router.post(
  "/customer-collectionlist",
  PermissonCheck.verifyToken,
  AgentController.customercollectionlist,
  Logger.Logres
);

router.post(
  "/colection-submisson",
  uploadAgent.any(),
  PermissonCheck.verifyToken,
  Logger.Logreq,
  (req, res, next) => {
    console.log("tridib");

    console.log(req.files, "check pic agent sub");
    const uploadPromises = req.files.map((file) => {
      console.log(SECRET, BUCKET_NAME, "d14");
      console.log(file.fieldname);
      if (file.fieldname == "receiptPic") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Agent/Payment/${req.body.AgentCode}_${Date.now()}.jpg`,
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
        req.body.CollPic = uploadResponses[0]?.Location;
        next();
      })
      .catch((err) => {
        console.error("Error uploading files to S3:", err);
        // Handle error
        res.status(500).json({ error: "Error uploading files to S3" });
      });
  },
  AgentController.colectionsubmisson,
  Logger.Logres
);
router.get(
  "/agentcode-list",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.showagentcode,
  Logger.Logres
);

router.post(
  "/scheme-addcustomer",
  uploadCustomer.any(),
  PermissonCheck.verifyToken,
  Logger.Logreq,
  (req, res, next) => {
    // Upload files to S3
    console.log(req.files, "check");
    const uploadPromises = req.files.map((file) => {
      console.log(SECRET, BUCKET_NAME, "d14");
      console.log(file.fieldname);
      if (file.fieldname == "NomineePhoto") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeProfilePhoto/${req.body.NomineeIdProofNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "NomineeIdProofPhoto") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeIdProof/${req.body.NomineeIdProofNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "Nomineesignature") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeSignature/${req.body.NomineeIdProofNumber}.jpg`,
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
  AgentController.schemeaddcustomer,
  Logger.Logres
);

router.post(
  "/scheme-editcustomer",
  uploadCustomer.any(),
  PermissonCheck.verifyToken,
  Logger.Logreq,
  (req, res, next) => {
    // Upload files to S3
    console.log(req.files, "check");
    const uploadPromises = req.files.map((file) => {
      console.log(SECRET, BUCKET_NAME, "d14");
      console.log(file.fieldname);
      if (file.fieldname == "NomineePhoto") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeProfilePhoto/${req.body.NomineeIdProofNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "NomineeIdProofPhoto") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeIdProof/${req.body.NomineeIdProofNumber}.jpg`,
          Body: file.buffer,
          ACL: "public-read", // Change the ACL according to your requirement
        };
        return s3.upload(params).promise();
      } else if (file.fieldname == "Nomineesignature") {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `Customer/NomineeSignature/${req.body.NomineeIdProofNumber}.jpg`,
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
  AgentController.schemeeditcustomer
);
router.post(
  "/lead-edit",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.updatelead,
  Logger.Logres
);
router.post(
  "/scheme-deletecustomer",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.schemedeletecustomer,
  Logger.Logres
);
router.post("/agent-yearly-performance", AgentController.AgentPerformance);
router.post("/agent-area-coll", AgentController.AreaAgentCollRepo);
router.post("/due-leads", AgentController.dueleads);
router.post(
  "/colection-status",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  AgentController.colectionstatus,
  Logger.Logres
);

router.post(
  "/agent-lotlist",
  PermissonCheck.verifyToken,
  AgentController.agentlotlist,
  Logger.Logres
);
module.exports = router;
