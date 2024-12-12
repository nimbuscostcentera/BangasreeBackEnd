const express = require("express");
const router = express.Router();
const { NotificationController } = require("../Controller/index");
const { PermissonCheck } = require("../Permisson/index");
const { Logger } = require("../Logger/index");
console.log("ok");

router.post(
  "/send-notification",PermissonCheck.verifyToken,Logger.Logreq,
  NotificationController.sendnottification,Logger.Logres
);

router.post(
  "/show-notification",PermissonCheck.verifyToken,Logger.Logreq,
  NotificationController.shownottification,Logger.Logres
);

router.post(
  "/read-notification",PermissonCheck.verifyToken,Logger.Logreq,
  NotificationController.readnottification,Logger.Logres
);

module.exports = router;
