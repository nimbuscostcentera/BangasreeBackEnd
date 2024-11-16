const { sq } = require("../../DataBase/ormdb");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class DeleteSchmService {
  async SchemeDelete(req, res, next) {
    try {
      const { Status, GSSID, SUUid } = req.body;
        console.log(req.body);
        const Agntsw = await sq.sync().then(async () => {
            await sq.query(
                "select SUUid from  schemeregisters where SUUid in(:SUUid) ",
                {
                  replacements: { SUUid: SUUid },
                  type: QueryTypes.SELECT,
                }
            ).then(async (schemReg) => {
                console.log(schemReg,"huiho");
                if (schemReg.length == 0) {
                  await sq
                    .query("Delete from schememasters where SUUid in (:id) ", {
                      replacements: { id: SUUid },
                      type: QueryTypes.DELETE,
                    })
                    .then((res2) => {
                      console.log("success :", res2);
                      return res.status(200).json({
                        errmsg: false,
                        response: "Deleted successfully",
                      });
                    })
                    .catch((err) => {
                      return res
                        .status(500)
                        .json({ errmsg: true, response: err });
                    });
                }
                else
                {
                  return res.status(400).json({
                    errMsg: true,
                    response:
                      "Alreday Asigned To A Customer You Can Not Delete This Scheme",
                  });
                }
              }).catch((err) => {
                 console.log("service1 ok");
                 return res.status(500).json({ errmsg: true, response: err });
              });
          }).catch((err) => {
            console.log(err);
            return res.status(500).json({ errmsg: true, response: err });
          });
      return Agntsw;
    }
    catch (error)
    {
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
}
module.exports = new DeleteSchmService();
