const { sq } = require("../../DataBase/ormdb");
const { AreaMasters } = require("../Model/AreaMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ShowAreaService {
  async AreaShow(req, res, next) {
    try {
      console.log("I am in area Show Service", req.body);
      let qt = {};
      var sql =
        "select AreaID,AreaName,Pincode,District,State,Status,country from areamasters  ";
      if (
        req.body.Status !== "" &&
        req.body.Status !== null &&
        req.body.Status !== undefined &&
        req.body.Status !== -1
      ) {
        sql = sql + " where status=:Status";
        qt.Status = req.body.Status;
      } else if (req.body.Status == -1) {
        sql = sql;
      }
      sql = sql + " Order By AreaName";
      const Areasw = await sq
        .query(sql, {
          replacements: qt,
          type: QueryTypes.SELECT,
        })
        .then(async (res2) => {
          if (res2.length != 0) {
            console.log(res2);
            res.status(200).json({ errmsg: false, response: res2 });
          } else {
            res.status(200).json({
              status: 500,
              errmsg: true,
              response: res2,
              msg: "No record Found",
            });
          }
        });
      console.log("service1 ok");
      return Areasw;
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new ShowAreaService();
