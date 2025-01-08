const { sq } = require("../../DataBase/ormdb");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ApproveSchmService {
  async SchemeApprove(req, res, next) {
    try {
      var Agntsw;
      console.log(req.body);
      const { Status, GSSID, SUUid } = req.body;
      if (SUUid) {
        console.log(req.body);
        SchemeRegisters.findAll({
          where: {
            SUUid: SUUid,
          },
        })
          .then(async (schemReg) => {

              Agntsw = await sq
                .query(
                  "Update schememasters set Status=:st where SUUid in(:id) ",
                  {
                    replacements: { st: Status, id: SUUid },
                    type: QueryTypes.UPDATE,
                  }
                )
                .then((res2) => {
                  console.log("success :", res2);
                  return res
                    .status(200)
                    .json({ errmsg: false, response: "Update successful" });
                })
                .catch((err) => {
                  return res.status(500).json({ errmsg: true, response: err });
                });

            console.log("service1 ok");
          })
          .catch((err) => {
            return res.status(500).json({ errmsg: true, response: err });
          });
      }
      return Agntsw;
    } catch (error) {
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
}
module.exports = new ApproveSchmService();
