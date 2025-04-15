const express = require("express");
const router = express.Router();
const { LoactionController } = require("../Controller/index");
const { PermissonCheck } = require("../Permisson/index");
const { Logger } = require("../Logger/index");
console.log("ok");

router.get(
  "/Location-list",PermissonCheck.verifyToken,Logger.Logreq,
  LoactionController.showlocation,Logger.Logres
);
module.exports = router;
