const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { v4: uuidv4 } = require("uuid");
class SchemeEditService {
  async SchemeEdit(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      const {
        CompanyCode,
        PageId,
        SchemeTitle,
        SUUid,
        Regfees,
        Status,
        Duration,
        Monthly,
        BONUS,
        GSSID,
        Weekly,
        Daily,
      } = req.body;
      console.log(req.body, "in scheme edit");
      //   const suuid=uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        await SchemeRegisters.findAll({
          where: {
            SUUid: SUUid,
          },
        }).then(async(schemReg) => {
            console.log(schemReg, "check");
          if (schemReg.length == 0)
          {
              await SchemeMasters.update(
                {
                  SchemeTitle: SchemeTitle,
                  Duration: Duration,
                  BONUS: BONUS,
                  Status: Status,
                  Regfees: Regfees,
                  Monthly: Monthly,
                  Weekly: Weekly,
                  Daily: Daily,
                  Status: Status,
                },
                {
                  where: {
                    SUUid: SUUid,
                  },
                }
              ).then(async(RegRes) => {
                  return res.status(200).json({
                    errMsg: false,
                    response: "Scheme Updated Succssfully",
                  });
                }).catch((err) => {
                  return res.status(500).json({
                    errMsg: false,
                    Response: "Scheme Updation failed." + err,
                  });
                });
            }
            else
            {
              console.log("in else");
              return res.status(400).json({
                errMsg: true,
                response:
                  "Alreday Asigned To A Customer You Can Not Edit This Scheme",
              });
            }
          }).catch((err) => {
            console.log(err);
            return res.status(500).json({
              errMsg: false,
              Response: "." + err,
            });
          });
      }).catch((err) => {
        return res.status(500).json({ errMsg: true, response: err });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new SchemeEditService();
