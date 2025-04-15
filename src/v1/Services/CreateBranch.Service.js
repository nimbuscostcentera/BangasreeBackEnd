const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
// const { Branch } = require("../Model/SchemeMaster.Model");
const { BranchMasters } = require("../Model/BranchMaster.Model");
// const { UserPermissions } = require("../Model/UserPermission.Model");
// const { PageMasters } = require("../Model/PageMaster.Model");
const { v4: uuidv4 } = require("uuid");
class BranchAddService {
  async CreateBranch(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      console.log(req.body, "try start");
      const { BranchCode, BranchName, CompanyCode } = req.body;

      const DBConnection = await sq.sync().then(async () => {
        console.log("i am in branch");
        BranchMasters.create({
          BranchCode: BranchCode,
          CompanyCode: CompanyCode,
          BranchName: BranchName,
          Status: 1,
        })
          .then((RegRes) => {
            console.log(RegRes);
            return res.status(200).json({
              errMsg: false,
              response: "Branch Created Successfully",
            });
          })
          .catch((err) => { 
            console.log(err.errors[0]?.ValidationErrorItem?.message,"1",err.parent[0],"error");
            return res.status(400).json({
              errMsg: false,
              response: "Branch Creation failed." + err,
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
module.exports = new BranchAddService();
