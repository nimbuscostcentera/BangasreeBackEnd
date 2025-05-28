const { sq } = require("../../DataBase/ormdb");
const { UserMasters } = require("../Model/UserMaster.Model");
const { PurityMasters } = require("../Model/PurityMaster.Model");
const { Goldrates } = require("../Model/Goldrate.Model");;
const { QueryTypes } = require("sequelize");
const { LogBookList } = require("../Model/LogBookList.Model");
const { LogBookPages } = require("../Model/LogBookPage.Model");
class SuperUserServices {
  async getAllSuperUser(req, res, next) {
    try {
      // var obj = {};
      // var obj1 = {};
      var startdate = "";
      var enddate = "";

      // var status = null;
      // var btn = "between";
      var startDateObj = "";
      var endDateObj = "";
      var time = "23:59:59";
      var time1 = "00:00:00";
      var qt = {};
      var BranchCode = req.body.BranchCode || "";
      var SuperUserType = req.body.SuperUserType || "";
      var SuperUserID = req.body.SuperUserID || "";
      var Status = req.body.Status;

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
      }
      var sql = "";
      sql =
        sql +
        "SELECT s.*,b.BranchName,b.BranchCode,d.Designation FROM superusermasters as s ,usermasters as u,branchmasters as b,designations as d where s.UUid = u.UUid and u.BranchId=b.BranchId and s.DID = d.Did";
      if (
        (req.body.Status !== null &&
          req.body.Status !== "" &&
          req.body.Status !== undefined &&
          req.body.Status !== -1) ||
        req.body.Status === 0
      ) {
        sql = sql + " and s.Status=:Status ";
        qt.Status = Status;
      }
      console.log(startDateObj, endDateObj, "date");
      if (startdate !== "" && enddate !== "") {
        sql = sql + " and  s.createdAt between :startDateObj and :endDateObj";
        qt.startDateObj = startDateObj;
        qt.endDateObj = endDateObj;
      }
      if (SuperUserID !== "") {
        sql = sql + " and  s.SuperUserID =:SuperUserID";
        qt.SuperUserID = SuperUserID;
      }
      if (BranchCode !== "") {
        console.log("hello not blank", BranchCode);
        if (SuperUserType != 1) {
          sql = sql + " and  u.BranchId =:Branchid";
          qt.Branchid = BranchCode;
        }
      }
      sql = sql + " order by s.createdAt DESC";
      const db = await sq.sync().then(async () => {
        await sq
          .query(sql, {
            replacements: qt,
            type: QueryTypes.SELECT,
          })
          .then(async (result) => {
            if (result.length != 0) {
              //  console.log(result);
              return res.status(200).json({ errMsg: false, response: result });
            } else {
              // console.log(result);
              return res.status(200).json({ errMsg: false, response: [] });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errMsg: true, response: err });
          });
      });
      return db;
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
              //   console.log(res2);
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
  async AddPurity(req, res, next) {
    try {
      console.log(req.body, "hello sweety");
      var usersw;
      const { PURITY, CompanyCode, DESCRIPTION } = req.body;
      if (PURITY !== "") {
        usersw = await sq.sync().then(async () => {
          await PurityMasters.findAll({
            where: {
              PURITY: PURITY,
              CompanyCode: CompanyCode,
            },
          }).then(async (res2) => {
            if (res2.length == 0) {
              await PurityMasters.create({
                PURITY: PURITY,
                CompanyCode: CompanyCode,
                DESCRIPTION: DESCRIPTION,
              })
                .then((RegRes) => {
                  // console.log(RegRes);
                  return res.status(200).json({
                    errMsg: false,
                    response: "Purity Added Successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({
                    errMsg: false,
                    Response: "Purity Add failed." + err,
                  });
                });
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: true,
                response: "Purity alreday exists",
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

  async ListPurity(req, res, next) {
    const { CompanyCode } = req.body;
    try {
      var usersw;
      usersw = await sq.sync().then(async () => {
        await PurityMasters.findAll({
          where: {
            CompanyCode: CompanyCode,
          },
        })
          .then(async (res2) => {
            //console.log(res2);
            if (res2.length != 0) {
              return res.status(200).json({
                status: 200,
                errmsg: false,
                response: res2,
              });
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: "NO Purity there",
                response: [],
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
        console.log("service1 ok");
      });
      return usersw; //can not return a local variable of if else statement
      // const users =  AgentMasters.findAll();
    } catch (error) {
      console.log(error, "hi error");

      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
  async AddGoldrate(req, res, next) {
    try {
      console.log(req.body, "hello sweety");
      var usersw;
      const { ID_PURITY, CompanyCode, GOLD_RATE } = req.body;
      let date = new Date();
      if (ID_PURITY !== "") {
        console.log("i'm in");

        usersw = await sq.sync().then(async () => {
          await Goldrates.findAll({
            where: {
              ID_PURITY: ID_PURITY,
              CompanyCode: CompanyCode,
              CURRDATE: date,
            },
          }).then(async (res2) => {
            if (res2.length == 0) {
              await Goldrates.create({
                ID_PURITY: ID_PURITY,
                CompanyCode: CompanyCode,
                CURRDATE: date,
                GOLD_RATE: GOLD_RATE,
              })
                .then((RegRes) => {
                  //console.log(RegRes);
                  return res.status(200).json({
                    errMsg: false,
                    response: "Goldrates Added Successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({
                    errMsg: false,
                    Response: "Goldrates Add failed." + err,
                  });
                });
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: true,
                response: "Gold rate alreday exists",
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
  async ShowGoldrate(req, res, next) {
    try {
      console.log(req.body, "hello sweety");
      var usersw;
      const { CompanyCode = "BJPL" } = req.body;
      let date = new Date();
      usersw = await sq.sync().then(async () => {
        await Goldrates.findAll({
          include: [
            {
              model: PurityMasters,
              attributes: [], // Do not nest PurityMasters but join it
            },
          ],
          attributes: [
            "ID",
            "CompanyCode",
            "GOLD_RATE",
            "CURRDATE",
            [sq.col("puritymaster.PURITY"), "PURITY"], // Add PURITY to the parent object
          ],
          where: {
            CompanyCode,
          },
          order: [["CURRDATE", "DESC"]],
        })
          .then(async (res2) => {
            //  console.log(res2);

            if (res2.length != 0) {
              return res.status(200).json({
                status: 200,
                errmsg: false,
                response: res2,
              });
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: "Gold rate  not exists",
                response: [],
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({
              errmsg: true,
              response: err.message,
            });
          });
        console.log("service1 ok");
      });

      return usersw; //can not return a local variable of if else statement
      // const users =  AgentMasters.findAll();
    } catch (error) {
      console.log(error);

      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
  async GetAllLogs(req, res, next) {
    try {
      const { utype,StartDate,EndDate } = req.body;
      console.log(req.body);
      
  let logres = await LogBookList.findAll({
    include: [
      {
        model: LogBookPages,
        required: true,
        as: "lgp",
        attributes: [], // Exclude columns from LogBookPages (optional)
      },
      {
        model: UserMasters,
        required: true,
        as: "um",
        attributes: [], // Exclude columns from UserMasters (optional)
      },
    ],
    attributes: [
      "LogID",
      "DateTime",
      "UserID",
      "Request",
      [sq.col("lgp.PageName"), "PageName"], // Correctly referencing lgp.PageName
      [sq.col("lgp.Description"), "Description"], // Correctly referencing lgp.Description
      [sq.col("um.UserName"), "UserName"], // Correctly referencing um.Name
    ],
  });
      return res.status(200).json({ errmsg: false, response: logres });
    }
    catch (error)
    {
      console.log(error);
      
      return res.status(400).json({errmsg:true,response:error.message})
    }
  }
}

module.exports = new SuperUserServices();
