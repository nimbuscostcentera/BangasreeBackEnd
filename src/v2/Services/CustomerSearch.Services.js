const { sq } = require("../../DataBase/ormdb");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class SerachCustService {
  async CustomerSearch(req, res, next) {
    try {
      var obj = {};
      var CustomerName;
      var like;
      if (req.query.CustomerName != null) {
        CustomerName = req.query.CustomerName;
        like = "%";
        CustomerName = CustomerName + like;
        obj.CustomerName = CustomerName;
      }
      // console.log(Object.keys(obj1).length);
      // sq.sync().then(() =>
      if (Object.keys(obj).length != 0) {
        // console.log("1st part");
        const Custsw = await sq
          .query(
            "select * from customermasters  where CustomerName like :status ",
            { replacements: { status: CustomerName }, type: QueryTypes.SELECT }
          )
          .then(async (res2) => {
            if (res2.length != 0) {
              console.log(res2);
              res.status(200).json({ errmsg: false, response: res2 });
            } else {
              res
                .status(200)
                .json({
                  status: 500,
                  errmsg: true,
                  response: res2,
                  msg: "No record Found",
                });
            }
          });
        console.log("service1 ok");

        // const users =  AgentMasters.findAll();
      }
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new SerachCustService();
