const express = require("express");
const router = express.Router();
const { AreaController } = require("../Controller/index");
const { PermissonCheck } = require("../Permisson/index");
const { Logger } = require("../Logger/index");
console.log("ok");

router.post(
  "/area-list",PermissonCheck.verifyToken,Logger.Logreq,
  AreaController.showarea,Logger.Logres
);


module.exports = router;
