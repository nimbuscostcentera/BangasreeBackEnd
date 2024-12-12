const express = require("express");
const router = express.Router();
const {SWCustomerController} = require("../Controller")
router.post("/customer",SWCustomerController.showcustomer)
module.exports=router;