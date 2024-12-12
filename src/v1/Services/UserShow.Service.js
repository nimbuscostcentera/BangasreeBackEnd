const { sq } = require("../../DataBase/ormdb");
const { UserMasters } = require("../Model/UserMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ShowUserService {
  async UserShow(req, res, next) {
    try
    {
      console.log(req.body);
      var usersw;
      const { Utype, CompanyCode,LoggerUUid,BranchId } = req.body;
      if (Utype!=='') {
         usersw = await sq.sync().then(async () => {
           await UserMasters.findAll({
             attributes: ["UserID", "UUid", "UserName", "PhoneNumber"],
             where: {
               CompanyCode: CompanyCode,
               Utype: Utype,
               BranchId: BranchId,
               UUid: {
                [Op.ne]: LoggerUUid // Op.ne represents "not equal"
              }
             },
           }).then(async (res2) => {
             if (res2.length != 0) {
               console.log(res2);
               return res.status(200).json({ errmsg: false, response: res2 });
             } else {
               return res
                 .status(200)
                 .json({
                   status: 500,
                   errmsg: true,
                   response: [],
                   meessge:"No Record Found"
                 });
             }
           });
           console.log("service1 ok");
         });
      }
      else {
         usersw = await sq.sync().then(async () => {
           await UserMasters.findAll({
             attributes: ["UserID", "UUid", "UserName", "PhoneNumber"],
             where: {
               CompanyCode: CompanyCode
             },
           }).then(async (res3) => {
             if (res3.length != 0) {
               console.log(res3);
               return res.status(200).json({ errmsg: false, response: res3 });
             } else {
               return res
                 .status(200)
                 .json({
                   status: 500,
                   errmsg: true,
                   response: [],
                   msg: "No record Found"
                 });
             }
           });
           console.log("service1 ok");
         });
     }
      return usersw;//can not return a local variable of if else statement
        // const users =  AgentMasters.findAll();
    }
    catch (error)
    {
      return res.status(500).json({ status: "FAILED", response: error  });
    }
  }
}
module.exports = new ShowUserService();
