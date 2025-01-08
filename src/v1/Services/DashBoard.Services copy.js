const { sq } = require("../../DataBase/ormdb");
const { PageMasters } = require("../Model/PageMaster.Model");
const { BranchMasters } = require("../Model/BranchMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class DashBoardServices {
  async YearlyReport(req, res, next) {
    try {
      var sql = "";
      var obj = {};
      var obj1 = {};
      var i;
      var j;
      var prevbranch = "";
      var qt = {};
      var CompanyCode = req.body.CompanyCode;
      var arr = [];
      var arr1 = [];
      BranchMasters.findAll({
        where: {
          CompanyCode: CompanyCode,
        },
      })
        .then(async (Result) => {
          var len = Result.length;
          var promises = [];
          for (let i = 0; i < len; i++) {
            let obj = {
              id: Result[i].dataValues.BranchName,
              data: [],
            };
            let qry =
              'select bm.BranchId,bm.BranchCode,bm.BranchName,mt.Month,SUM(mt.ActualCollection) from monthlytrans as mt INNER JOIN schemeregisters as sr on mt.SchemeRegId=sr.ID INNER JOIN usermasters as um on um.UUid=sr.UUid INNER JOIN branchmasters as bm on bm.BranchId=um.BranchId  where mt.Month like "%2023" group by mt.Month';
            let sql =
              "SELECT um.branchid, bm.BranchName, MONTH(et.CollDate) AS TransactionMonth, YEAR(et.CollDate) AS TransactionYear, SUM(et.CollectedAmt) AS TotalCollection FROM emitrans AS et JOIN usermasters AS um ON et.AgentUUid = um.UUid JOIN branchmasters AS bm ON um.BranchId = bm.BranchId WHERE YEAR(et.CollDate) = YEAR(CURRENT_DATE()) and et.PaymentStatus=1 AND um.BranchId =:BranchId GROUP BY um.branchid, bm.BranchName, TransactionMonth, TransactionYear Order by um.branchid ";
            let qt = { BranchId: Result[i].dataValues.BranchId };
            let promise = sq
              .query(sql, { replacements: qt, type: QueryTypes.SELECT })
              .then(async (rst) => {
                var len1 = rst.length;
                var arr1 = [];
                for (let j = 0; j < len1; j++) {
                  let obj1 = {};
                  switch (rst[j].TransactionMonth) {
                    case 1:
                      obj1.x = "jan";
                      break;
                    case 2:
                      obj1.x = "feb";
                      break;
                    case 3:
                      obj1.x = "mar";
                      break;
                    case 4:
                      obj1.x = "apr";
                      break;
                    case 5:
                      obj1.x = "may";
                      break;
                    case 6:
                      obj1.x = "jun";
                      break;
                    case 7:
                      obj1.x = "jul";
                      break;
                    case 8:
                      obj1.x = "aug";
                      break;
                    case 9:
                      obj1.x = "sep";
                      break;
                    case 10:
                      obj1.x = "oct";
                      break;
                    case 11:
                      obj1.x = "nov";
                      break;
                    case 12:
                      obj1.x = "dec";
                      break;
                    // Add cases for other months similarly
                  }
                  obj1.y = rst[j].TotalCollection;
                  arr1.push(obj1);
                }
                obj.data = arr1;
                return obj;
              })
              .catch((err) => {
                console.error("Error executing query:", err);
                return null;
              });
            promises.push(promise);
          }
          return Promise.all(promises);
        })
        .then((arr) => {
          // Filter out any null values due to errors
          arr = arr.filter((item) => item !== null);
          return res.status(200).json({ errmsg: false, response: arr });
        })
        .catch((err) => {
          console.error("Error fetching BranchMasters:", err);
        });
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
  async DuePayments(req, res, next) {
    try {
      var sql = "";
      var qt = {};
      var date = new Date();
      var mnth = date.getMonth() + 1;
      var mnth = date.getMonth() + 1;
      var yr = date.getFullYear().toString();
      var month = mnth + "-" + yr;
      var sql = "";
      var qt = {};
      sql =
        "select sr.emi,sr.id,cm.CustomerName,cm.agentcode,sr.CustomerAccNo from schemeregisters as sr,customermasters as cm where cm.uuid=sr.UUid and  sr.id not in(SELECT  SchemeRegId from  monthlytrans where month=:month )";
      qt.month = month;
      const Db = sq
        .query(sql, { replacements: qt, type: QueryTypes.SELECT })
        .then((resp) => {
          return res.status(200).json({ status: "FAILED", response: resp });
        })
        .catch((err) => {
          console.log(err);
        });
      return Db;
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
  async Card(req, res, next) {
    try {
      var sql = "";
      var obj = {};
      var obj1 = {};
      var i;
      var j;
      var prevbranch = "";
      var qt = {};
      var CompanyCode = req.body.CompanyCode;
      var arr = [];
      var arr1 = [];
      var date = new Date();
      var mnth = date.getMonth() + 1;
      var mnth = date.getMonth() + 1;
      var yr = date.getFullYear().toString();
      var month = mnth + "-" + yr;
      var sql = "";
      var qt = {};
      var Utype = req.body.Utype;
      var UUid = req.body.UUid;
      var promises = [];
      console.log(req.body);
      if (Utype == 1) {
        sq.query(
          `
            SELECT
                (SELECT COUNT(CustomerID) FROM customermasters WHERE Status=1) AS TotalCust,
                (SELECT COUNT(AgentID) FROM agentmasters WHERE Status=1) AS TotalAgent,
                (SELECT COUNT(Id) FROM schemeregisters WHERE MaturityStatus=3) AS TotalMaturedAcc,
                (SELECT COUNT(SuperUserID) FROM superusermasters WHERE Status=1) AS TotalSuperUser,
                (SELECT COALESCE(SUM(CollectedAmt), 0) FROM emitrans) AS TotalCollection
        `,
          { type: QueryTypes.SELECT }
        )
          .then(async (result) => {
            const obj = {
              TotalCust: result[0].TotalCust,
              TotalAgent: result[0].TotalAgent,
              TotalMaturedAcc: result[0].TotalMaturedAcc,
              TotalSuperUser: result[0].TotalSuperUser,
              TotalCollection: result[0].TotalCollection,
            };
            return res.status(200).json({ errmsg: false, response: obj });
          })
          .catch((error) => {
            // Handle error
            console.error(error);
            return res
              .status(500)
              .json({ errmsg: true, error: "Internal Server Error" });
          });
      } else if (Utype == 2) {
        const agentCode = req.body.AgentCode;
        sq.query(
          `
            SELECT
                (SELECT COUNT(CustomerID) FROM customermasters WHERE Status=1  and AgentCode= '${agentCode}') AS TotalCust,
                (SELECT COUNT(sr.Id) FROM schemeregisters as sr,customermasters as cm WHERE sr.MaturityStatus=3 and sr.UUid=cm.UUid and cm.AgentCode= '${agentCode}' ) AS TotalMaturedAcc,
                (SELECT Commision FROM agentmasters WHERE Status=1 and AgentCode= '${agentCode}') AS Commision,
                (SELECT COALESCE(SUM(et.CollectedAmt), 0) FROM emitrans as et,agentmasters as am where et.AgentUUid=am.UUid and am.AgentCode= '${agentCode}') AS TotalCollection
        `,
          { type: QueryTypes.SELECT }
        )
          .then(async (result) => {
            const obj = {
              TotalCust: result[0].TotalCust,
              TotalMaturedAcc: result[0].TotalMaturedAcc,
              TotalCollection: result[0].TotalCollection,
              Commission: result[0].Commision || 0,
            };
            console.log(obj);
            return res.status(200).json({ errmsg: false, response: obj });
          })
          .catch((error) => {
            // Handle error
            console.error(error);
            return res
              .status(500)
              .json({ errmsg: true, error: "Internal Server Error" });
          });
      } else if (Utype == 3) {
        const CustUUid = req.body.CustUUid;
        sq.query(
          `SELECT
            (SELECT AM.Name  FROM agentmasters AS AM INNER JOIN customermasters AS CM ON AM.AgentCode = CM.AgentCode WHERE CM.UUid ='${CustUUid}')AS AgentName,
            (SELECT COUNT(sr.ID) FROM schemeregisters as sr inner join customermasters as cm on sr.UUid=cm.UUid WHERE sr.MaturityStatus=3 and sr.UUid='${CustUUid}' ) AS TotalMaturedAcc,
            (SELECT COUNT(sr.ID) FROM schemeregisters as sr inner join customermasters as cm on sr.UUid=cm.UUid WHERE sr.UUid= '${CustUUid}') AS TotalNoOfAcc,
            (select SUM(et.CollectedAmt) from emitrans as et inner join schemeregisters as sr on et.SchemeRegId=sr.ID where sr.UUid= '${CustUUid}') AS TotalPayedAmt`,
          { type: QueryTypes.SELECT }
        )
          .then(async (result) => {
            const obj = {
              AgentName: result[0].AgentName,
              TotalAcc: result[0].TotalNoOfAcc,
              TotalMaturedAcc: result[0].TotalMaturedAcc,
              TotalPayedAmt: result[0].TotalPayedAmt,
            };
            return res.status(200).json({ errmsg: false, response: obj });
          })
          .catch((error) => {
            // Handle error
            console.error(error);
            return res
              .status(500)
              .json({ errmsg: true, error: "Internal Server Error" });
          });
      }
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
}
module.exports = new DashBoardServices();
