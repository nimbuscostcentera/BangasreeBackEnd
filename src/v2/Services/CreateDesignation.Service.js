const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
// const { Branch } = require("../Model/SchemeMaster.Model");
const { designations } = require("../Model/Designation.Model");

const { v4: uuidv4 } = require("uuid");
// const { UserPermissions } = require("../Model/UserPermission.Model");
// const { PageMasters } = require("../Model/PageMaster.Model");

class DesignationAddService {
  async CreateDesignation(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      console.log(req.body, "try start");
      const { Designation, CompanyCode} = req.body;
      const uuid = uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        console.log("i am in branch");
        designations.create({
          CompanyCode: CompanyCode,
          Designation: Designation,
          UUid: uuid,
          Status: 1,
        })
          .then((RegRes) => {
            console.log(RegRes);
            return res.status(200).json({
              errMsg: false,
              response: "Designation Created Succssfully",
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              errMsg: false,
              Response: "Designation Creation failed." + err,
            });
          });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new DesignationAddService();
