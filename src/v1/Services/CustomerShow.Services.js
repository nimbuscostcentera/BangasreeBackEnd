const { sq } = require("../../DataBase/ormdb");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ShowCustService {
  async CustomerShow(req, res, next) {
    try {
      var startDate;
      var endDate;
      var STATUS;
      var startDateObj;
      var endDateObj;
      var startDate;
      var endDate;
      var AreaID;
      var time1 = "00:00:00";
      var time = "23:59:59";
      var obj = {};
      var sql =
        "SELECT  c.*,a.AreaName,b.branchname,b.BranchId,b.BranchCode,ag.Name,ag.agentcode,ag.AgentID,ag.UUid as AgentUUid FROM customermasters as c  INNER JOIN  usermasters as u on c.UUid=u.UUid INNER JOIN agentmasters as ag on ag.AgentCode=c.AgentCode INNER JOIN branchmasters as b ON u.BranchId=b.BranchId  INNER JOIN areamasters as a on c.AreaID=a.AreaID ";
      const { CompanyCode, UUid, CustUUid, AgentCode } = req.body;
      if (
        (req.body.Status !== null &&
          req.body.Status !== "" &&
          req.body.Status !== -1 &&
          req.body.Status !== undefined) ||
        req.body.Status === 0
      ) {
        STATUS = req.body.Status;
        obj.Status = STATUS;
        sql = sql + " and  c.status=:Status ";
      }
      if (AgentCode !== null && AgentCode !== "" && AgentCode !== undefined) {
        sql = sql + " and c.AgentCode=:AgentCode ";
        obj.AgentCode = AgentCode;
      }
      if (CustUUid !== null && CustUUid !== "" && CustUUid !== undefined) {
        console.log(CustUUid, "abjsjjs");
        obj.CustUUid = CustUUid;
        console.log(obj, "assign obj", CustUUid);
        sql = sql + " and c.UUid=:CustUUid ";
      }

      if (
        req.body.startDate !== null &&
        req.body.startDate !== "" &&
        req.body.startDate !== undefined &&
        req.body.endDate !== null &&
        req.body.endDate !== undefined &&
        req.body.endDate !== ""
      ) {
        startDate = req.body.startDate;
        endDate = req.body.endDate;
        startDateObj = `${startDate} ${time1}`;
        endDateObj = `${endDate} ${time}`;
        sql = sql + " and u.createdAt between :startDateObj and :endDateObj";
        obj.startDateObj = startDateObj;
        obj.endDateObj = endDateObj;
      }
      if (
        req.body.LoggerBranchId != "" &&
        req.body.LoggerBranchId != null &&
        req.body.LoggerBranchId != -1 &&
        req.body.LoggerBranchId != undefined &&
        req.body.SuperUserType !== 1
      ) {
        sql = sql + " and b.BranchId=:bid ";
        obj.bid = req.body.LoggerBranchId;
      }
      if (
        req.body.BranchId != "" &&
        req.body.BranchId != null &&
        req.body.BranchId != -1 &&
        req.body.BranchId != undefined &&
        req.body.SuperUserType == 1
      ) {
        sql = sql + " and b.BranchId=:bid ";
        obj.bid = req.body.BranchId;
      }
      if (
        req.body.AreaID != "" &&
        req.body.AreaID != null &&
        req.body.AreaID != -1 &&
        req.body.AreaID != undefined
      ) {
        sql = sql + " and c.AreaID=:AreaID ";
        obj.AreaID = req.body.AreaID;
      }
      sql = sql + " and c.status <> 0 order by c.createdAt desc";
      const a = await sq
        .query(sql, { replacements: obj, type: QueryTypes.SELECT })
        .then(async (Result) => {
          if (Result.length != 0) {
            return res.status(200).json({ errmsg: false, response: Result });
          } else {
            return res.status(200).json({
              errmsg: true,
              msg: "No record Found",
              response: Result,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return a;
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new ShowCustService();
