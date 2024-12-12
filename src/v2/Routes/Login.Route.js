const express = require("express");
const router = express.Router();
const {AuthController} = require("../Controller")
router.post("/loginservices",AuthController.securelogin)
router.post("/registration",AuthController.registration)
// router.post("/loginauthcontroller/loginservices/login",securelogin);
module.exports=router;