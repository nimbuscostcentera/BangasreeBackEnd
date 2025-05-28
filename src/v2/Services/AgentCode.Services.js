const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ShowAreaCodeService {
  async AgentCodeShow(req, res, next) {
    try
    {
      console.log(req.body, "agent code find here");
      const { BranchId } = req.body;
      var sql =
        "select a.AgentCode,a.Commision as Commision ,a.UUid,a.Name,b.BranchCode from agentmasters as a INNER JOIN usermasters as u on a.UUid=u.UUid INNER JOIN branchmasters as b on u.BranchId=b.BranchId where a.Status=1";
      var qt = {};
      if ((BranchId !== undefined) & (BranchId !== null) && BranchId !== "")
      {
        sql = sql + " and u.BranchId=:BranchId";
        qt.BranchId = BranchId;
      }
      sql = sql + " order by a.Name asc"
      var AgentCodeList = await sq
        .query(sql, { replacements: qt, type: QueryTypes.SELECT })
        .then(async (res2) => {
          if (res2.length != 0) {
            //console.log(res2);
           return  res.status(200).json({ errmsg: false, response: res2 });
          } else {
           return res.status(200).json({ errmsg: true, response: [] });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ errmsg: true, response:err });
        });
      return AgentCodeList;
    }
    catch (error)
    {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new ShowAreaCodeService();
