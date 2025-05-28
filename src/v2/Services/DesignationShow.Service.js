const { sq } = require("../../DataBase/ormdb");
const { designations } = require("../Model/Designation.Model");
const { QueryTypes, where } = require("sequelize");
const { Op } = require("sequelize");

class DopdownDesignationService {
  async DropDownDesignation(req, res, next) {
    try {
      var obj = {};
      console.log(req.body,"uff");
      const { CustUUid } = req.body;

      const Custsw = await sq.sync().then(async () => {
        console.log(CustUUid);
           designations.findAll({
            where: {
                Status:1,
            }}
           ) 
          .then(async (res2) => {
            console.log(res2,"I am result");
            if (res2.length != 0) {
              res.status(200).json({ errmsg: false, response: res2 });
            } else {
              res.status(200).json({
                errmsg: true,
                msg: "No record Found",
                response: res2,
              });
            }
          }).catch((err)=>{console.log(err,"error")});

        // const users =  AgentMasters.findAll();
      });
      return Custsw;
    } 
    catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new DopdownDesignationService();
