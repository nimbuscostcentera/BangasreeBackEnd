const { sq } = require("../../DataBase/ormdb");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");

class DopdownSchemeService {
  async DropDownScheme(req, res, next) {
    try {
      var obj = {};
      console.log(req.body, "uff in drow down");
      const { CustUUid,ID } = req.body;

      const Custsw = await sq
        .sync()
        .then(async () => {
          console.log(CustUUid,ID,"check");
          var sql=""
          var qt={}
          if (ID=="" || ID == undefined || ID==null)
          {
            sql="SELECT SM.SCHEMETITLE,SR.EMI,SR.frequency,SR.CustomerAccNo,SR.ID,SM.Regfees,SM.Duration,SM.BONUS,SR.PassBookNo FROM schemeregisters AS SR ,schememasters AS SM WHERE SM.SUUid=SR.SUUid and  SM.Status=1 and SR.MaturityStatus = 1  "
            qt.uuid=CustUUid
          }
          else{
            sql="SELECT SM.SCHEMETITLE,SR.EMI,SR.frequency,SR.CustomerAccNo,SR.ID,SM.Regfees,SM.Duration,SM.BONUS,SR.PassBookNo FROM schemeregisters AS SR ,schememasters AS SM WHERE SM.SUUid=SR.SUUid and SM.Status=1 and SR.MaturityStatus = 1 and SR.ID=:ID   "
          //  qt="replacements: { uuid: CustUUid,ID: ID }"
            qt.uuid=CustUUid
            qt.ID=ID
          }
          sql=sql+"AND SR.UUID=:uuid  "
          await sq
            .query(
              sql,
              {
                replacements: qt,
                type: QueryTypes.SELECT,
              }
            )
            .then(async (res2) => {
              console.log(res2, "I am result");
              if (res2.length != 0) {
                res.status(200).json({ errmsg: false, response: res2 });
              } else {
                res.status(200).json({
                  errmsg: true,
                  msg: "No record Found",
                  response: res2,
                });
              }
            })
            .catch((err) => {
              console.log(err, "error");
            });

          // const users =  AgentMasters.findAll();
        })
        .catch((err) => {
          console.log(err);
        });
      return Custsw;
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new DopdownSchemeService();
