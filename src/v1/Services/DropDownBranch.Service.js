const { sq } = require("../../DataBase/ormdb");
const { BranchMasters } = require("../Model/BranchMaster.Model");
// const { UserMasters } = require("../Model/UserMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ShowBranchService {
  async DropDownBranch(req, res, next) {
    try {
      var obj = {};
      const { CompanyCode, UUid, AgentCode, Status, AreaID } = req.body;
      console.log(req.body, "in dbranch");
      var sql = "";
      var qt = {};
      var replaceobj = {};
      sql =
        sql +
        "select B.BranchId,B.BranchCode,B.BranchName,B.Status as BranchStatus from branchmasters as B where B.CompanyCode =:CompanyCode";
       
      const Custsw = await sq.sync().then(async () => {
        replaceobj.CompanyCode=CompanyCode
        if (
          (Status !== "" && Status !== null && Status !== undefined && Status !==-1) ||
          Status === 0
        ) {
          sql = sql + " and B.Status=:Status";
          replaceobj.Status = Status;
        } else if (Status == -1)
        {
          sql = sql;
          }

        if (
          AreaID !== "" &&
          AreaID !== null &&
          AreaID !== undefined &&
          Array.isArray(AreaID) === false
        ) {
          sql = sql + " and B.AreaID =:AreaID";
          replaceobj.AreaID = AreaID;
        }
        if (Array.isArray(AreaID)) {
          sql = sql + " and B.AreaID in (:AreaID)";
          replaceobj.AreaID = AreaID;
        }
        sql = sql + " order by B.createdAt DESC";
        replaceobj.CompanyCode=CompanyCode
        if (
          (Status != "" && Status != null && Status != undefined) ||
          Status === 0 ||
          (AreaID !== "" && AreaID !== null && AreaID !== undefined)
        ) {
          qt.replacements = replaceobj;
          qt.type = QueryTypes.SELECT;
        } else {
          qt.replacements = replaceobj;
          qt.type = QueryTypes.SELECT;
        }
        console.log("\n", sql, "\n", qt, "dur");
        await sq
          .query(sql, qt)
          .then(async (res2) => {
          //  console.log(res2, "branch data");
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
            console.log(err);
            return res.status(400).json({
              status: "FAILED",
              data: err,
              response: err,
            });
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
module.exports = new ShowBranchService();
