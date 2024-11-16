const express = require("express");
const router = express.Router();
const {SWAgentController} = require("../Controller")
router.post("/agent",SWAgentController.showagent)
module.exports=router;