const express = require("express");
const router = express.Router();
const { SuperUserController } = require("../Controller/index");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const { AuthController } = require("../Controller");
const { PermissonCheck } = require("../Permisson/index");
const fs = require("fs");
require("dotenv").config();
var baseurl = "F:/Bangashree/BangaSreeBackEnd/Images";
const { Logger } = require("../Logger/index");
const dotenv = require("dotenv");
require("dotenv").config({ path: "../../../.env" });
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

router.post(
  "/superuser-show",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.ListofSuperUser,
  Logger.Logres
);
router.post(
  "/user-list",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.showuser,
  Logger.Logres
);

router.post(
  "/page-list",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.showpage,
  Logger.Logres
);

router.post(
  "/user-permisson",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.permissonuser,
  Logger.Logres
);

router.post(
  "/user-permissonadd",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.permissonadduser,
  Logger.Logres
);

router.post(
  "/scheme-add",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.schemeadd,
  Logger.Logres
);

router.post(
  "/scheme-view",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.schemeview,
  Logger.Logres
);

router.post(
  "/scheme-edit",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.schemeedit,
  Logger.Logres
);

router.get(
  "/scheme-search",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.schemesearch,
  Logger.Logres
);
router.post(
  "/scheme-approve",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.schemeapprove,
  Logger.Logres
);
router.post(
  "/maturity-status",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.maturitystatus,
  Logger.Logres
);
router.post(
  "/bonus-status",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.bonusstatus,
  Logger.Logres
);

router.post(
  "/branch-dropdown",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.dropdownbranch,
  Logger.Logres
);

router.post(
  "/branch-create",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.createbranch,
  Logger.Logres
);

router.post(
  "/branch-edit",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.editbranch,
  Logger.Logres
);

router.post(
  "/area-create",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.createarea,
  Logger.Logres
);

router.post(
  "/area-edit",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.editarea,
  Logger.Logres
);

router.post(
  "/branch-approve",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.approvebranch,
  Logger.Logres
);
router.post(
  "/area-approve",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.approvearea,
  Logger.Logres
);
router.post(
  "/superuser-approve",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.approvesuperuser,
  Logger.Logres
);
router.post(
  "/passbook-create",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.createpassbook,
  Logger.Logres
);
router.post(
  "/passbook-branchtransfer",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.transferpassbook,
  Logger.Logres
);
router.post(
  "/passbook-agentassign",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbookassign,
  Logger.Logres
);
router.post(
  "/passbook-agentreturn",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbookreturn,
  Logger.Logres
);
router.post(
  "/passbook-custassign",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbookassigncust,
  Logger.Logres
);

router.post(
  "/passbook-custreturn",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbookreturncust,
  Logger.Logres
);
router.post(
  "/passbook-dropdown",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbookdropdown,
  Logger.Logres
);
router.post(
  "/passbook-stock",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbookstock,
  Logger.Logres
);
router.post(
  "/passbook-show",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbookshow,
  Logger.Logres
);

router.post(
  "/superuser-edit",
  uploadSuperuser.any(),
  PermissonCheck.verifyToken,
  Logger.Logreq,
  (req, res, next) => {
    let uploadPromises = [];
    console.log(req.files, "find me");
    if (req.files != "" && req.files != undefined && req.files != null) {
      uploadPromises = req?.files?.map((file) => {
        console.log(SECRET, BUCKET_NAME, "d14");
        console.log(file.fieldname, "find me");
        if (file.fieldname == "Photo") {
          const params = {
            Bucket: BUCKET_NAME,
            Key: `Superuser/ProfilePhoto/${req.body.PhoneNumber}.jpg`,
            Body: file.buffer,
            ACL: "public-read", // Change the ACL according to your requirement
          };
          return s3.upload(params).promise();
        } else if (file.fieldname == "IdPhoto") {
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
      console.log(uploadPromises);
    }
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
  SuperUserController.superuseredit,
  Logger.Logres
);

router.post(
  "/superuser-delete",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.superuserdelete,
  Logger.Logres
);

router.post(
  "/agent-delete",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.agentdelete,
  Logger.Logres
);

router.post(
  "/customer-delete",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.customerdelete,
  Logger.Logres
);

router.post(
  "/user-list",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.userlist,
  Logger.Logres
);

router.post(
  "/branch-delete",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.deletebranch,
  Logger.Logres
);

router.post(
  "/area-delete",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.deletearea,
  Logger.Logres
);

router.post(
  "/scheme-delete",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.deletescheme,
  Logger.Logres
);

router.post(
  "/designation-dropdown",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.designationdropdown,
  Logger.Logres
);

router.post(
  "/passbook-notAssign",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.passbooknotassign,
  Logger.Logres
);
router.post(
  "/designation-create",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.designationcreate,
  Logger.Logres
);
router.post(
  "/maturity-certificate",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.maturitycertificate,
  Logger.Logres
);
router.post(
  "/maturity-certificateshow",
  PermissonCheck.verifyToken,
  Logger.Logreq,
  SuperUserController.maturitycertificateshow,
  Logger.Logres
);
router.post(
  "/dashboard-yearlyreport",
  Logger.Logreq,
  SuperUserController.yearlyreport,
  Logger.Logres
);
router.post(
  "/dashboard-Maturity",
  Logger.Logreq,
  SuperUserController.maturityreport,
  Logger.Logres
);
router.post(
  "/dashboard-card",
  Logger.Logreq,
  SuperUserController.card,
  Logger.Logres
);
router.post(
  "/top-agent-collection",
  Logger.Logreq,
  SuperUserController.topAgentCollection,
  Logger.Logres
);
router.post(
  "/session-list",
  Logger.Logreq,
  SuperUserController.yearlist,
  Logger.Logres
);
router.post(
  "/delete-collection",
  Logger.Logreq,
  SuperUserController.deletecollection,
  Logger.Logres
);

router.post(
  "/scheme-history",
  Logger.Logreq,
  SuperUserController.schemehistory,
  Logger.Logres
);
router.post(
  "/add-purity",
  Logger.Logreq,
  SuperUserController.addpurity,
  Logger.Logres
);

router.post(
  "/list-purity",
  Logger.Logreq,
  SuperUserController.listpurity,
  Logger.Logres
);

router.post(
  "/add-goldrate",
  Logger.Logreq,
  SuperUserController.addgoldrate,
  Logger.Logres
);

router.post(
  "/show-goldrate",
  Logger.Logreq,
  SuperUserController.showgoldrate,
  Logger.Logres
);
router.post(
  "/logbook-list",
  Logger.Logreq,
  SuperUserController.ViewLogs,
  Logger.Logres
);
module.exports = router;
