const { sq } = require("../../DataBase/ormdb");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class NotificationUpdateService{
 
  async NotificationRead(req, res, next) {
    try {
      console.log(req.body,"service in update notify");
      var Custsw;
      var val = "";
      var value = [];
      const { read, Notificationid  } = req.body
           await sq
            .query(
              `Update notificationdetails set Seen=:read where Notificationid = :Notificationid `,
              {
                replacements: { Notificationid: Notificationid, read: read },
                type: QueryTypes.UPDATE,
              }
            )
            .then(async (res2) => {
                return res
                .status(200)
                .json({ errmsg: false, response: "Update successful" });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ errmsg: true, response: err });
            });
    } 
    catch (error) 
    {
      console.log(error);
      return res.status(500).json({ status: "FAILED", response: error  });
    }
  }
}
module.exports = new NotificationUpdateService();
