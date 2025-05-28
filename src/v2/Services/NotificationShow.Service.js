const { sq } = require("../../DataBase/ormdb");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class NotificationShowService {
  async NotificationShow(req, res, next) {
    try {
      //console.log(req.body, "in notify show");
      var UserID;
      if (
        req.body.UserID != null &&
        req.body.UserID != "" &&
        req.body.UserID != undefined
      ) {
        UserID = req.body.UserID;
      }
      var seen = req.body.seen;

      await sq
        .query(
          " SELECT Nd.*,um.UserName as Receiver FROM notificationdetails as Nd,notificationheaders as Nm,usermasters as um WHERE Nd.`TicketId`=Nm.`TicketId` and Nd.ToUser=:UserID AND Nd.toUser=um.UserID ORDER by Nd.createdAt desc",
          {
            replacements: { UserID: UserID },
            type: QueryTypes.SELECT,
          }
        )
        .then(async (res2) => {
          if (res2.length != 0) {
           console.log(res2);
            res.status(200).json({ errmsg: false, response: res2 });
          } else {
            res.status(200).json({
              status: 500,
              errmsg: true,
              response: res2,
              msg: "No record Found",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // console.log("service1 ok");

      // const users =  AgentMasters.findAll();
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new NotificationShowService();
