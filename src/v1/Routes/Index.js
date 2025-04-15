const express = require("express");
const router = express.Router();
const authentication  = require("./Auth.Route.js");
const AgentRoutes  = require("./Agent.Route.js");
const CustomerRoutes  = require("./Customer.Route.js");
const SuperUserRoutes = require("./SuperUser.Route.js");
const AreaRoutes = require("./Area.Route.js");
const NotificationRoutes=require("./Notification.Route.js");



console.log("2");
router.use("/auth-routes", authentication)
router.use("/agent-routes", AgentRoutes);
router.use("/customer-routes", CustomerRoutes);
router.use("/superuser-routes", SuperUserRoutes);
router.use("/area-routes", AreaRoutes);
router.use("/notification-routes",NotificationRoutes);

module.exports=router