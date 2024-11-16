const { sq } = require("../../DataBase/ormdb");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { Op } = require("sequelize");

class ShowCustService {
  async DropDownCustomer(req, res, next) {
    try {
      console.log("drop down");
      var obj = {};
      console.log("all");
      const { CompanyCode, UUid, AgentCode } = req.body;

      console.log(req.body, "agent code");
      var obj = { Status: 1 };
      if (AgentCode !== undefined && AgentCode !== null && AgentCode !== '')
      {
        obj.AgentCode=AgentCode
        }
      const Custsw = await sq.sync().then(async () => {
        CustomerMasters.findAll({
          where: obj
        }).then(async (res2) => {
          // console.log(rse2,"customer data");
          if (res2.length != 0) {
            res.status(200).json({ errmsg: false, response: res2 });
          } else {
            res.status(200).json({
              errmsg: true,
              msg: "No record Found",
              response: res2,
            });
          }
        });

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
module.exports = new ShowCustService();
