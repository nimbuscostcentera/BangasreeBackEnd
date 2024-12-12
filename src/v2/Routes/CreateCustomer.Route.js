const express = require("express");
const router = express.Router();
const {CustomerController} = require("../Controller")
console.log("ok");
router.post("/registercustomer",CustomerController.createcust)
module.exports=router;
