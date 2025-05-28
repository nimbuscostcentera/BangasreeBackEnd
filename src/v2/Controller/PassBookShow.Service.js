const { sq } = require("../../DataBase/ormdb");
const { PassBookMaster } = require("../Model/PassBookMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class PassBookShowService {
  async DropDownPassbook(req, res, next) {
    try {
      var obj = {};

      const { CompanyCode, AgentID } = req.body;

      console.log(req.body,"agentjhgkjhgjh");
       PassBookMaster.findAll({
        where: {
          AgentId: AgentID,
          Status: 1,
          CompanyCode: CompanyCode,
        },
      }).then(async (res2) => {
         console.log(res2,"customer data");
        if (res2.length != 0) {
          res.status(200).json({ errmsg: false, response: res2 });
        } else {
          res.status(200).json({
            errmsg: true,
            msg: "No record Found",
            response: res2,
          });
        }
      }).catch((err)=>{console.log(err)});
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async PassbookStock(req, res, next) {
    try {
      var obj = {};
      var sql = "";
      var qt = "";
      const { CompanyCode, AgentId, BranchId } = req.body;
      if (
        req.body.BranchId != "" &&
        req.body.BranchId != null &&
        req.body.BranchId != undefined
      ) {
        sql =
          sql +
          "select Bm.BranchCode,Bm.BranchName,count(Pm.PassBookNo) as NoOfPassBook from branchmasters as Bm,passbookmasters as Pm where Pm.BranchId =Bm.BranchId  and   Pm.CompanyCode=:CompanyCode and Pm.BranchId=:BranchId  and Pm.Status=3 group by Pm.BranchId,Pm.CompanyCode ";
        qt = {
          replacements: { BranchId: BranchId, CompanyCode: CompanyCode },
          type: QueryTypes.SELECT,
        };
      }

      if (
        req.body.AgentId != "" &&
        req.body.AgentId != null &&
        req.body.AgentId != undefined
      ) {
        sql =
          sql +
          "select Am.AgentCode,Am.Name,count(Pm.PassBookNo) as NoOfPassBook,pm.* from agentmasters as Am,passbookmasters as Pm where Pm.AgentId =Am.AgentID  and   Pm.CompanyCode=:CompanyCode and Pm.AgentId=:AgentId  and Pm.Status=1 group by Pm.AgentId,Pm.CompanyCode ";
        qt = {
          replacements: { AgentId: AgentId, CompanyCode: CompanyCode },
          type: QueryTypes.SELECT,
        };
      }
      await sq.query(sql, qt).then(async (res2) => {
        console.log(res2, "pb data");
        if (res2.length != 0) {
          res.status(200).json({ errmsg: false, response: res2 });
        } else {
          res.status(200).json({
            errmsg: true,
            msg: "No record Found",
            response: res2,
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async ShowPassbook(req, res, next) {
    try {
      var obj = {};

      const { CompanyCode, CustomerID } = req.body;

      console.log(req.body);
      if (
        req.body.CustomerID != "" &&
        req.body.CustomerID != null &&
        req.body.CustomerID != "undefined"
      ) {
        await PassBookMaster.findAll({
          where: {
            CustomerID: CustomerID,
            Status: 2,
            CompanyCode: CompanyCode,
          },
        })
          .then(async (res2) => {
            // console.log(rse2,"customer data");
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
              errMsg: false,
              response: "failed" + err,
              err,
            });
          });
      } else {
        await PassBookMaster.findAll({
          where: {
            Status: 3,
            CompanyCode: CompanyCode,
          },
        })
          .then(async (res2) => {
            console.log(res2, "customer data");
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
              errMsg: false,
              response: "failed" + err,
              err,
            });
          });
      }
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async UnAssignedPBList(req, res, next) {
    try {
      var obj = {};
      const { CompanyCode, BranchId } = req.body;
      console.log(req.body);
      await PassBookMaster.findAll({
        where: {
          BranchId: BranchId,
          Status: 3,
          CompanyCode: CompanyCode,
        },
      }).then(async (res2) => {
        console.log(res2,"not assigned data");
        if (res2.length != 0) {
          res.status(200).json({ errmsg: false, response: res2 });
        } else {
          res.status(200).json({
            errmsg: true,
            msg: "No record Found",
            response: res2,
          });
        }
      });
    } catch (error) {
      return res.status(error?.status || 500).json({
        status: "FAILED",
        data: { error: error?.message || error },
      });
    }
  }
}
module.exports = new PassBookShowService();
