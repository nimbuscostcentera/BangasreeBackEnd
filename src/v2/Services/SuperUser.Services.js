const { sq } = require("../../DataBase/ormdb");
const { SuperUserMasters } = require("../Model/SuperUserMaster.Model");
const { BranchMasters } = require("../Model/BranchMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class SuperUserServices {
  async getAllSuperUser(req, res, next) {
    try {
      var obj = {};
      var obj1 = {};
      var startdate = "";
      var enddate = "";
      var SuperUserID = "";
      var BranchCode;
      var status = null;
      var btn = "between";
      var startDateObj = "";
      var endDateObj = "";
      var time = "23:59:59";
      var time1 = "00:00:00";
      var sql = "";

      var qt;
      console.log(req.body, "check");
      if (
        req.body.SuperUserID !== null &&
        req.body.SuperUserID !== "" &&
        req.body.SuperUserID !== undefined
      ) {
        SuperUserID = req.body.SuperUserID;
        obj.SuperUserID = SuperUserID;
      }
      if (
        (req.body.Status !== null &&
          req.body.Status !== "" &&
          req.body.Status !== undefined) ||
        req.body.Status === 0
      ) {
        status = req.body.Status;
        obj.Status = status;
      }
      if (
        req.body.startDate !== null &&
        req.body.startDate !== "" &&
        req.body.startDate !== undefined &&
        req.body.endDate !== null &&
        req.body.endDate !== "" &&
        req.body.endDate !== undefined
      ) {
        startdate = req.body.startDate;
        enddate = req.body.endDate;
        startDateObj = `${startdate} ${time1}`;
        endDateObj = `${enddate} ${time}`;
        obj.createdAt = { [Op.between]: [startDateObj, endDateObj] };
      }
      if (
        req.body.Branchid !== null &&
        req.body.Branchid !== "" &&
        req.body.Branchid !== undefined
      ) {
        BranchCode = req.body.BranchCode;
        obj1.Branchid = BranchCode;
      }
      sql =
        sql +
        "SELECT s.*,b.BranchName,b.BranchCode,d.Designation,a.AreaName FROM superusermasters as s,usermasters as u,branchmasters as b,designations as d,areamasters as a where s.UUid = u.UUid and u.BranchId=b.BranchId and b.AreaID=a.AreaID AND s.DID = d.Did ";
      if (req.body.Status === "") {
        console.log("thids");
      }
      if (req.body.Status !== "") {
        console.log("thifds");
      }
      if (
        (req.body.Status !== null &&
          req.body.Status !== "" &&
          req.body.Status !== undefined &&
          req.body.Status !== -1) ||
        req.body.Status === 0
      ) {
        console.log(status, "ststus");
        sql = sql + "and s.Status=:status";
      }
      console.log(startDateObj, endDateObj, "date");
      if (startdate !== "" && enddate !== "") {
        sql = sql + " and  s.createdAt between :startDateObj and :endDateObj";
      }
      if (SuperUserID !== "") {
        sql = sql + " and  s.SuperUserID =:SuperUserID";
      }
      sql = sql + " order by s.createdAt DESC";
      if (
        (status !== "" || status === 0) &&
        status !== null &&
        startDateObj == "" &&
        endDateObj === ""
      ) {
        qt = {
          replacements: {
            status: status,
          },
          type: QueryTypes.SELECT,
        };
      } else if (status !== "" && startdate !== "" && enddate !== "") {
        qt = {
          replacements: {
            status: status,
            startDateObj: startDateObj,
            endDateObj: endDateObj,
          },
          type: QueryTypes.SELECT,
        };
      } else if (status === "" && startdate !== "" && enddate !== "") {
        qt = {
          replacements: {
            startDateObj: startDateObj,
            endDateObj: endDateObj,
          },
          type: QueryTypes.SELECT,
        };
      } else if (SuperUserID !== "") {
        qt = {
          replacements: {
            SuperUserID: SuperUserID,
          },
          type: QueryTypes.SELECT,
        };
      } else {
        qt = {
          type: QueryTypes.SELECT,
        };
      }
      console.log(sql, qt, "check1");
      await sq.sync().then(async () => {
        // if(obj1.length==0)
        // {
        await sq
          .query(sql, qt)
          .then((result) => {
            //console.log(result.length);
            if (result.length != 0) {
              //console.log(result);
              return res.status(200).json({ errMsg: false, response: result });
            } else {
              //console.log(result);
              return res.status(204).json({ errMsg: false, response: result });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errMsg: true, response: err });
          });
        // }
        // else
        // {
        //   sq.query("select * from superusermasters,usermasters where usermasters.UUid = superusermasters.UUid and usermasters.BranchCode=:BranchCode",

        //   )
        // }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
  async ListUser(req, res, next) {
    try {
      console.log(req.body, "hello sweety");
      var usersw;
      const { Utype, CompanyCode, BranchId } = req.body;
      if (Utype !== "" && BranchId !== "") {
        usersw = await sq.sync().then(async () => {
          await UserMasters.findAll({
            attributes: [
              "UserID",
              "UUid",
              "UserName",
              "PhoneNumber",
              "BranchId",
            ],
            where: {
              BranchId: BranchId,
              Utype: Utype,
              CompanyCode: CompanyCode,
            },
          }).then(async (res2) => {
            if (res2.length != 0) {
              //console.log(res2);
              return res.status(200).json({ errmsg: false, response: res2 });
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: true,
                response: res2,
              });
            }
          });
          console.log("service1 ok");
        });
      }
      return usersw; //can not return a local variable of if else statement
      // const users =  AgentMasters.findAll();
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
}

module.exports = new SuperUserServices();
