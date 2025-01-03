const { sq } = require("../../DataBase/ormdb");
const { PageMasters } = require("../Model/PageMaster.Model");
const { BranchMasters } = require("../Model/BranchMaster.Model");
const { YearMasters } = require("../Model/YearMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const moment = require("moment");
class DashBoardServices {
  async YearlyReport(req, res, next) {
    try {
      console.log(req.body, "yearly");
      var sql = "";
      var obj = {};
      var obj1 = {};
      var i;
      var j;
      var prevbranch = "";
      var qt = {};
      var CompanyCode = req.body.CompanyCode;
      var StartDate = req.body.StartDate;
      var EndDate = req.body.EndDate;
      let bid = req.body.LoggerBranchId;
      let branchid = req.body.BranchId;
      let SuperUserType = req.body.SuperUserType;
      let agentCode = req.body.AgentCode;
      let area = req.body.AreaID;
      var arr = [];
      var arr1 = [];

      let whereClause = {
        CompanyCode: CompanyCode,
      };

      if (branchid !== null && branchid !== undefined) {
        whereClause.BranchId = branchid;
      }
      BranchMasters.findAll({
        where: whereClause,
      })
        .then(async (Result) => {
          var len = Result.length;
          var promises = [];
          for (let i = 0; i < len; i++) {
            let obj = {
              id: Result[i].dataValues.BranchName,
              data: [],
            };
            let sql =
              "SELECT um.branchid, bm.BranchName, MONTH(et.CollDate) AS TransactionMonth, YEAR(et.CollDate) AS TransactionYear, SUM(et.CollectedAmt) AS TotalCollection FROM emitrans AS et JOIN usermasters AS um ON et.AgentUUid = um.UUid JOIN branchmasters AS bm ON um.BranchId = bm.BranchId JOIN agentmasters AS AM ON AM.UUid=um.UUid WHERE et.CollDate between :StartDate and :EndDate and (et.PaymentStatus=3 or et.PaymentStatus=1 ) AND um.BranchId =:BranchId ";
            if (
              agentCode != null &&
              agentCode != "" &&
              agentCode != "undefined"
            ) {
              sql = sql + " AM.AgentCode=:agentCode";
            }

            if (area != null && area != "" && area != "undefined") {
              sql = sql + " et.AreaID=:area";
            }
            sql =
              sql +
              " GROUP BY um.branchid, bm.BranchName, TransactionMonth, TransactionYear Order by um.branchid ";
            let qt = {
              BranchId: Result[i].dataValues.BranchId,
              StartDate: StartDate,
              EndDate: EndDate,
            };

            if (
              agentCode != null &&
              agentCode != "" &&
              agentCode != "undefined"
            ) {
              qt.agentCode = agentCode;
            }
            if (area != null && area != "" && area != "undefined") {
              qt.area = area;
            }
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
                  obj1.y = (rst[j].TotalCollection / 100000).toFixed(2);
                  arr1.push(obj1);
                }
                obj.data = arr1;
                return obj;
              })
              .catch((err) => {
                console.error("Error executing query:", err);
                return null;
              });
            if (
              (SuperUserType !== 1 && Result[i].dataValues.BranchId == bid) ||
              SuperUserType == 1
            ) {
              promises.push(promise);
            }
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

      // const users =  AgentMasters.findAll();
    } catch (error) {
      return res.status(400).json({ status: "FAILED", response: error });
    }
  }
  async AgentYearlyReport(req, res, next) {
    try {
      console.log(req.body, "top 5agent ");
      var CompanyCode = req.body.CompanyCode;
      var StartDate = req.body.StartDate;
      var EndDate = req.body.EndDate;
      let bid = req.body.LoggerBranchId;
      let BranchName = req.body.BranchName;
      let Utype = req.body.Utype;
      let UUid = req.body.LoggerUUid;
      let obj = {
        id: BranchName,
        data: [],
      };
      let sql =
        "SELECT Month(CollDate)as TransactionMonth,YEAR(CollDate) as TransactionYear,SUM(CollectedAmt) as TotalCollection FROM emitrans WHERE PaymentStatus in (3,1,2) and AgentUUid=:UUid and colldate between :StartDate and :EndDate GROUP BY  TransactionMonth, TransactionYear";
      let qt = { UUid: UUid, StartDate: StartDate, EndDate: EndDate };
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
            }
            obj1.y = (rst[j].TotalCollection / 1000).toFixed(2);
            arr1.push(obj1);
          }
          obj.data = arr1;
          return res.status(200).json({ response: [obj] });
        })
        .catch((err) => {
          console.error("Error executing query:", err);
          return res.status(400).json({ status: "FAILED", response: err });
        });
      return promise;
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
  async DuePayments(req, res, next) {
    try {
      console.log(req.body, "due");

      var sql = "";
      var qt = {};
      var date = new Date();
      var mnth = date.getMonth() + 1;
      var mnth = date.getMonth() + 1;
      var yr = date.getFullYear().toString();
      var month = mnth + "-" + yr;
      var BranchId = req.body.BranchId;
      var sql = "";
      var qt = {};
      sql =
        "select sr.emi,sr.id,cm.CustomerName,cm.agentcode,sr.CustomerAccNo from schemeregisters as sr,customermasters as cm,usermasters as um where cm.uuid=sr.UUid and  sr.id not in(SELECT  SchemeRegId from  monthlytrans where month=:month )";
      if (SuperUserType != 1) {
        sql = sql + "and um.BranchId=:BranchId";
        qt.BranchId = BranchId;
      }

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
      console.log(req.body, "card");

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
      var BranchId = req.body.BranchId;
      var SuperUserType = req.body.SuperUserType;
      var today = moment(req.body.today).format("YYYY-MM-DD");

      var promises = [];

      if (Utype == 1) {
        if (SuperUserType == 1) {
          sql = `SELECT
          (SELECT COUNT(CustomerID) FROM customermasters WHERE Status=1) AS TotalCust,
          (SELECT COUNT(AgentID) FROM agentmasters WHERE Status=1) AS TotalAgent,
          (SELECT COUNT(Id) FROM schemeregisters WHERE MaturityStatus=3) AS TotalMaturedAcc,
          (SELECT COUNT(SuperUserID) FROM superusermasters WHERE Status=1) AS TotalSuperUser,
          (SELECT COALESCE(SUM(et.CollectedAmt), 0) FROM emitrans as et where CollDate =:today
          and et.PaymentType=2 ) AS TotalCollection`;
          qt.today = today;
        } else {
          sql = `SELECT
          (SELECT COUNT(CM.CustomerID) FROM customermasters AS CM,usermasters AS UM WHERE
          CM.Status=1 AND UM.UUid=CM.UUid  AND UM.BranchId=:BranchId) AS TotalCust,
          (SELECT COUNT(AM.AgentID) FROM agentmasters AS AM,usermasters AS UM WHERE AM.Status=1
          AND UM.UUid=AM.UUid  AND UM.BranchId=:BranchId) AS TotalAgent,
          (SELECT COUNT(sr.Id) FROM schemeregisters sr,usermasters AS UM WHERE sr.MaturityStatus=3
           AND UM.UUid=sr.UUid  AND UM.BranchId=:BranchId) AS TotalMaturedAcc,
          (SELECT COUNT(sm.SuperUserID) FROM superusermasters sm,usermasters AS UM WHERE
           sm.Status=1 AND UM.UUid=sm.UUid  AND UM.BranchId=:BranchId) AS TotalSuperUser,
          (SELECT COALESCE(SUM(CollectedAmt), 0) FROM emitrans as et,usermasters AS UM WHERE
           UM.UUid=et.CustomerUUid  AND UM.BranchId=:BranchId and CollDate =:today and
           et.PaymentType=2) AS TotalCollection`;
          qt.BranchId = BranchId;
          qt.today = today;
        }

        sq.query(sql, { replacements: qt, type: QueryTypes.SELECT })
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
              .status(400)
              .json({ errmsg: true, response: error.message });
          });
      } else if (Utype == 2) {
        const agentCode = req.body.AgentCode;
        sq.query(
          `SELECT
           (SELECT COUNT(CustomerID) FROM customermasters WHERE Status=1  and AgentCode= '${agentCode}') AS TotalCust,
           (select count(CustomerID) from proabablecustomers where AgentCode ='${agentCode}') as TotalLeads,
           (SELECT Commision FROM agentmasters WHERE Status=1 and AgentCode= '${agentCode}') AS Commision,
           (SELECT COALESCE(SUM(et.CollectedAmt), 0) FROM emitrans as et,agentmasters as am where et.AgentUUid=am.UUid and am.AgentCode= '${agentCode}') AS TotalCollection`,
          { type: QueryTypes.SELECT }
        )
          .then(async (result) => {
            const obj = {
              TotalCust: result[0].TotalCust,
              TotalLeads: result[0].TotalLeads,
              TotalCollection: result[0].TotalCollection,
              Commission: result[0].Commision || 0,
            };
            return res.status(200).json({ errmsg: false, response: obj });
          })
          .catch((error) => {
            // Handle error
            console.error(error);
            return res
              .status(400)
              .json({ errmsg: true, response: error.message });
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
              .status(400)
              .json({ errmsg: true, response: error.message });
          });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ status: "FAILED", response: error.message });
    }
  }
  async MaturityReport(req, res, next) {
    try {
      var CompanyCode = req.body.CompanyCode;
      var BranchId = req.body.BranchId;
      var SuperUserType = req.body.SuperUserType;
      let sql = "";
      var arr1 = [];
      var qt = {};
      if (SuperUserType == 1) {
        sql =
          "SELECT count(ID) as cnt, MaturityStatus FROM schemeregisters GROUP BY MaturityStatus";
      } else {
        sql =
          "SELECT count(sr.ID) as cnt, sr.MaturityStatus FROM schemeregisters as sr,usermasters AS UM WHERE  UM.UUid=sr.UUid  AND UM.BranchId=:BranchId GROUP BY sr.MaturityStatus";
        qt.BranchId = BranchId;
      }

      let rst = await sq.query(sql, {
        replacements: qt,
        type: QueryTypes.SELECT,
      });

      var len1 = rst.length;

      for (var j = 0; j < len1; j++) {

        let label;
        if (rst[j].MaturityStatus == 1) {
          label = "Active Account";
        } else if (rst[j].MaturityStatus == 2) {
          label = "PreMatured Account";
        } else if (rst[j].MaturityStatus == 3) {
          label = "Matured Account";
        }

        let obj1 = {
          id: label,
          label: label,
          value: rst[j].cnt,
        };

        arr1.push(obj1);
      }

      return res.status(200).json({ pieData: arr1 });
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
  async topAgent(req, res, next) {
    let qt = {};
    let arr = [];
    console.log("top agent", req.body);

    let sql2 = `SELECT a.AgentCode,ar.AreaID,a.Name,ar.AreaName,SUM(et.CollectedAmt) as
                Total_Collection FROM emitrans as et INNER JOIN agentmasters as a  on
                et.AgentUUid = a.UUid INNER JOIN areamasters as ar on et.AreaID = ar.AreaID
                WHERE et.AgentUUid=:uuid GROUP by ar.AreaID`;

    let sql1 = `select et.AgentUUid,a.Name,a.AgentCode FROM emitrans as et INNER JOIN 
                agentmasters as a on et.AgentUUid=a.UUid GROUP by AgentUUid ORDER BY
                SUM(et.CollectedAmt) DESC limit 5`;

    let db = await sq
      .query(sql1, { replacements: qt, type: QueryTypes.SELECT })
      .then(async (resp) => {
        let len = resp?.length;
        if (len == 0) {
          return res.status(200).json({ msg: "no data exist" });
        } else {
          for (let i = 0; i < len; i++) {
            let RespObj = {};
            let trans = {};
            RespObj.AgentName = resp[i]?.Name;

            await sq
              .query(sql2, {
                replacements: { uuid: resp[i]?.AgentUUid },
                type: QueryTypes.SELECT,
              })
              .then(async (rep) => {
                rep.map((i) => {
                  trans[i?.AreaName] = (i?.Total_Collection / 100000).toFixed(
                    2
                  );
                });
                let sortedobj = Object.keys(trans).sort(
                  (a, b) => trans[b] - trans[a]
                );

                let i = 0;
                let sumcoll = 0;
                for (i = 0; i < sortedobj.length; i++) {
                  if (trans[sortedobj[i]] >= 2) {
                    RespObj[sortedobj[i]] = trans[sortedobj[i]];
                  } else {
                    sumcoll = sumcoll + Number(trans[sortedobj[i]]);
                  }
                }
                RespObj["Others"] = sumcoll.toFixed(2);
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({ data: err });
              });
            arr.push(RespObj);
          }
          return res.status(200).json({ errMsg: false, BarData: arr });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ data: err });
      });
    return db;
  }
  async AreaWiseAgentCollection(req, res, next) {
    console.log(req.body, "AreaWiseAgentCollection");
    let UUid = req?.body?.LoggerUUid;
    let sql = `select sum(et.collectedAmt)as totalCollection,ar.AreaName from emitrans as et 
    Inner Join customermasters as cm on et.CustomerUUid=cm.UUid inner join  areamasters as ar on 
    cm.Areaid=ar.areaID where AgentUUid=:UUid group by ar.AreaName order by totalCollection desc limit 10`;
    let qt = {
      UUid: UUid,
    };
    let db = await sq
      .query(sql, { replacements: qt, type: QueryTypes.SELECT })
      .then(async (resp) => {
        if (resp?.length !== 0) {
          return res.status(200).json({ errMsg: false, response: resp });
        } else {
          return res.status(200).json({ errMsg: false, response: [] });
        }
      })
      .catch((err) => {
        return res.status(400).json({ errMsg: false, response: err });
      });
    return db;
  }
  async SessionList(req, res, next) {
    let db = await sq
      .sync()
      .then(async (resp1) => {
        await YearMasters.findAll({
          attributes: ["SessionID", "Session", "StartDate", "EndDate"],
        }).then(async (resp2) => {
          if (resp2.length !== 0) {
            
            return res.status(200).json({ errMsg: false, response: resp2 });
          } else {
            
            return res
              .status(200)
              .json({ errMsg: false, response: "no data found" });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ errMsg: false, response: err });
      });
  }
  async LeadToBeFollow(req, res, next) {
    console.log(req.body, "lead");

    let { AgentCode } = req.body;
    let sql = `SELECT CustomerID,CustomerName,FollowUpDate,AgentCode,PhoneNumber from proabablecustomers
     where AgentCode =:AgentCode and FollowUpDate <= now();`;
    let db = await sq
      .query(sql, {
        replacements: { AgentCode: AgentCode },
        type: QueryTypes.SELECT,
      })
      .then(async (resp) => {
        return res.status(200).json({ errMsg: false, response: resp });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ errMsg: false, response: err });
      });
    return db;
  }
}
module.exports = new DashBoardServices();
