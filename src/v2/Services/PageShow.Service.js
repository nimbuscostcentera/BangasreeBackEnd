const { sq } = require("../../DataBase/ormdb");
const { PageMasters } = require("../Model/PageMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class PageShowService {
  async PageShow(req, res, next) {
    try {
      // console.log(req.body);
      var usersw;
      const { Utype, CompanyCode, LoggerUUid } = req.body;
      usersw = await sq
        .query(
          "SELECT p.`PageId`, p.`PageName`, p.`PageUrl`,p.`Icon` FROM `pagemasters` as p INNER JOIN userpermissions as u on p.PageId=u.PageId WHERE u.UUid=:UUid and u.CompanyCode=:CompanyCode and u.view=1 and p.Priority<>0 order by p.Priority ASC;",
          {
            replacements: { UUid: LoggerUUid, CompanyCode: CompanyCode },
            type: QueryTypes.SELECT,
          }
        )
        .then(async (res2) => {
          // console.log(res2);
          if (res2.length != 0) {
            return res.status(200).json({ errmsg: false, response: res2 });
          } else {
            return res
              .status(400)
              .json({ errmsg: false, response: "No Access" });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .json({ errmsg: true, response: "not accessable" });
        });
      return usersw; //can not return a local variable of if else statement
      // const users =  AgentMasters.findAll();
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
}
module.exports = new PageShowService();
