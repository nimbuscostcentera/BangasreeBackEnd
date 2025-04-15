const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ShowAgntService {
  async AgentShow(req, res, next) {
    try {
      var obj = {};
      var obj1 = {};
      var startDateObj;
      var endDateObj;
      var startDate;
      var endDate;
      var time1 = "23:59:59";
      var time = "00:00:00";
      console.log(req.body, "re");
      var Agntsw = {};
      console.log(obj, obj1, "Chechk");
      console.log("2nd part");
      var qt = {};
      var sql = "";
      sql =
        sql +
        "select a.*,br.BranchId,br.branchname,br.branchcode,ar.areaname from agentmasters as a,areamasters as ar,usermasters as u,branchmasters as br where u.uuid=a.uuid and u.branchid=br.branchid and a.areaid=ar.areaid";
      if (
        (req.body.Status != "" &&
          req.body.Status != null &&
          req.body.Status != -1 &&
          req.body.Status != undefined) ||
        req.body.Status === 0
      ) {
        sql = sql + " and a.status=:status ";
        qt.status = req.body.Status;
      }
      if (
        req.body.startDate != null &&
        req.body.startDate !='' &&
        req.body.endDate != null &&
        req.body.endDate != ''
      ) {
        startDate = req.body.startDate;
        endDate = req.body.endDate;
        startDateObj = `${startDate} ${time}`;
        endDateObj = `${endDate} ${time1}`;
        obj.createdAt = { [Op.between]: [startDateObj, endDateObj] };
        sql = sql + " and a.createdAt between :startDateObj and :endDateObj";
        qt.startDateObj = startDateObj;
        qt.endDateObj = endDateObj;
      }
      if (
        (req.body.LoggerBranchId != "" &&
          req.body.LoggerBranchId != null &&
          req.body.LoggerBranchId != -1 &&
          req.body.LoggerBranchId != undefined) &&
        req.body.SuperUserType!==1
      ) {
        sql = sql + " and br.BranchId=:bid ";
        qt.bid = req.body.LoggerBranchId;
      }
      sql = sql + " order by a.createdAt DESC ";
console.log(qt,"this is my qt");
      Agntsw = await sq.sync().then(async () => {
        console.log("i am in agent list");
        await sq
          .query(sql, { replacements: qt, type:QueryTypes.SELECT })
          .then(async (res2) => {
            console.log(res2);
            if (res2.length != 0) {
              return res.status(200).json({ errmsg: false, response: res2 });
            } else {
              return res
                .status(200)
                .json({ errmsg: true, response: res2, msg: "No Record Found" });
            }
          }).catch((err) => {
            console.log(err);
          });
      }).catch((err) => {
        console.log(err);
      })

      return Agntsw;
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
}
module.exports = new ShowAgntService();
