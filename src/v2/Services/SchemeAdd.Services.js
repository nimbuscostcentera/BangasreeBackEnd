const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { schemehistory } = require("../Model/Schemehistory.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { v4: uuidv4 } = require("uuid");
class SchemeAddService {
  async SchemeAdd(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      console.log(req.body, "try start");
      const {
        CompanyCode,
        LoggerUUid,
        SchemeTitle,
        BONUS,
        RegFees,
        Duration,
        Daily=0,
        Monthly=0,
        Weekly=0
      } = req.body;
      const Suuid = uuidv4();
      var date = new Date();
      const DBConnection = await sq.sync().then(async () => {
        await UserMasters.findAll({
          where: {
            CompanyCode: CompanyCode,
            UUid: LoggerUUid,
          },
        })
          .then(async (result) => {
            if (result.length != 0) {
              await SchemeMasters.create({
                SUUid: Suuid,
                CompanyCode: CompanyCode,
                SchemeTitle: SchemeTitle,
                BONUS: BONUS,
                Regfees: RegFees,
                Duration: Duration,
                Daily:Daily,
                Monthly:Monthly,
                Weekly:Weekly,
                Status: 1,
              })
                .then(async(RegRes) => {
                  console.log(RegRes);
                  await schemehistory.create({
                    SUUid: Suuid,              
                    CompanyCode: CompanyCode,
                    Regfees: RegFees,
                    Date:date,
                    LoggerUUid:LoggerUUid
                  })
                  .then(async(RegRes) => {
                  return res.status(200).json({
                    errMsg: false,
                    response: "Scheme Created Successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({
                    errMsg: false,
                    Response: "Scheme Creation failed." + err,
                  });
                });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({
                    errMsg: false,
                    Response: "Scheme Creation failed." + err,
                  });
                });
            } else {
              return res.status(400).json({
                errMsg: true,
                message: "You are Not Authorized To Access This Page",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({ errMsg: true, response: err });
          });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new SchemeAddService();
