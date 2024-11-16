const express = require("express");
const router = express.Router();
const {AgentController} = require("../Controller")
console.log("ok");
router.post("/registeragent",AgentController.createagent)
module.exports=router;




