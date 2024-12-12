const { sq } = require("../../DataBase/ormdb");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { Op } = require("sequelize");

class SchemeViewService {
  async SchemeView(req, res, next) {
    try {
      var obj = {};
      console.log(req.body, "gsss");
      const { CompanyCode, UUid } = req.body;
      if (
        req.body.GSSID !== '' &&
        req.body.GSSID !== null &&
        req.body.GSSID !== undefined
      ) {
        obj.GSSID = req.body.GSSID;
      }

      if (
        req.body.SUUid !== '' &&
        req.body.SUUid !== null &&
        req.body.SUUid !== undefined
      ) {
        obj.SUUid = req.body.SUUid;
      }

      if (
        (req.body.Status !== "" &&
          req.body.Status !== null &&
          req.body.Status !== -1 &&
          req.body.Status !== undefined) ||
        req.body.Status === 0
      ) {
        obj.Status = req.body.Status;
      }
      if (
        req.body.Duration !== '' &&
        req.body.Duration !== null &&
        req.body.Duration !== undefined
      ) {
        obj.Duration = req.body.Duration;
      }
      if (
        req.body.DurationType !== '' &&
        req.body.DurationType !== null &&
        req.body.DurationType !== undefined
      ) {
        obj.DurationType = req.body.DurationType;
      }

      if (
        req.body.SchemeTitle !== '' &&
        req.body.SchemeTitle !== null &&
        req.body.SchemeTitle !== undefined
      ) {
        obj.SchemeTitle = req.body.SchemeTitle;
      }

      const Custsw = await sq.sync().then(async () => {
        console.log("service1 ok");
 
          console.log(obj);
      
            SchemeMasters.findAll({ where: obj || 1 }).then(
              async (finalRes) => {
                if (finalRes.length != 0) {
                  return res
                    .status(200)
                    .json({ errmsg: false, response: finalRes });
                } else {
                  console.log("no");
                  return res.status(200).json({
                    errMsg: true,
                    message: "There is no scheme exists",
                  });
                }
              }
            );
    
       

        // const users =  AgentMasters.findAll();
      });
      return Custsw;
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new SchemeViewService();
