const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { MonthlyTrans } = require("../Model/MonthlyTrans.Model");
const { Op } = require("sequelize");
const moment = require("moment");
class Custdetailpayment {
  async CustomerPaymentShow(req, res, next) {
    console.log(req.body, "reqbody");
    try {
      const {
        Due = null,
        startDate = null,
        endDate = null,
        AgentCode = null,
        CustomerID = null,
        PaymentStatus = null,
        CollectionId = null,
        SchemeRegId = null,
        CompanyCode = null,
        PaymentType = null,
        LotId = null,
      } = req.body;
      // console.log(req.body, "in show service");
      var NotAgentPayment = -1;
      if (
        (req.body.NotAgentPayment !== "" &&
          req.body.NotAgentPayment !== undefined &&
          req.body.NotAgentPayment !== -1 &&
          req.body.NotAgentPayment !== null) ||
        req.body.NotAgentPayment === 0
      ) {
        console.log("in not agen", NotAgentPayment);
        NotAgentPayment = req.body.NotAgentPayment;
      }
      // console.log("in not agen", NotAgentPayment);
      var dt1 = null;
      var dt2 = null;
      var time1 = "23:59:59";
      var time = "00:00:00";
      var repobj = {};
      var sqlstring =
        "SELECT et.PaymentType ,et.CollectionId,et.CustomerUUid,et.CollectionUUId,cm.CustomerName,cm.UUid as CustUUid,sm.SchemeTitle,sm.Duration,sm.Regfees,sm.createdAt as SchemeStartDate,sr.frequency,et.CollectedAmt " +
        " as totcolection, et.CollDate, sr.SUUid, sr.StartDate, sr.EMI, cm.AgentCode,am.Commision as Commission, et.PaymentMode, et.PaymentStatus,sr.ID, " +
        " et.MICR, et.TransactionId, sr.MaturityStatus, sr.BonusStatus, sr.CustomerAccNo, et.NotAgentPayment,Area.AreaName,Bm.BranchName from customermasters " +
        " as cm, schememasters as sm, schemeregisters as sr, emitrans as et,agentmasters as am,usermasters as um,areamasters as Area,branchmasters as Bm  where sr.UUid = cm.UUid and sr.SUUid = sm.SUUid and " +
        " et.SchemeRegId = sr.id and et.CustomerUUid = sr.UUid and cm.AgentCode=am.AgentCode and et.CustomerUUid=um.UUid and et.AreaID=Area.AreaID and um.BranchId=Bm.BranchId ";

      if (
        startDate !== null &&
        startDate !== undefined &&
        startDate !== "" &&
        endDate !== null &&
        endDate !== "" &&
        endDate !== undefined
      ) {
        dt1 = `${startDate} ${time}`;
        dt2 = `${endDate} ${time1}`;
        sqlstring = sqlstring + " and et.CollDate between :dt1 and :dt2 ";
        repobj.dt1 = dt1;
        repobj.dt2 = dt2;
      }
      if (
        AgentCode !== null &&
        AgentCode !== "" &&
        AgentCode !== undefined &&
        AgentCode !== -1
      ) {
        console.log("hello", AgentCode);
        sqlstring = sqlstring + " and cm.AgentCode=:AgentCode ";
        repobj.AgentCode = AgentCode;
      }
      if (
        PaymentType !== null &&
        PaymentType !== undefined &&
        PaymentType !== "" &&
        PaymentType !== -1
      ) {
        sqlstring = sqlstring + " and et.PaymentType=:PaymentType ";
        repobj.PaymentType = PaymentType;
      }
      if (CustomerID !== null && CustomerID !== undefined && CustomerID != "") {
        sqlstring = sqlstring + " and cm.CustomerID=:CustomerID ";
        repobj.CustomerID = CustomerID;
      }
      if (
        PaymentStatus !== null &&
        PaymentStatus !== "" &&
        PaymentStatus !== undefined &&
        PaymentStatus !== -1
      ) {
        sqlstring = sqlstring + " and et.paymentstatus=:paymentstatus ";
        repobj.paymentstatus = PaymentStatus;
      }
      if (
        CollectionId !== null &&
        CollectionId !== undefined &&
        CollectionId !== ""
      ) {
        sqlstring = sqlstring + " and et.CollectionId=:CollectionId ";
        repobj.CollectionId = CollectionId;
      }
      if (LotId !== null && LotId !== undefined && LotId !== "") {
        sqlstring = sqlstring + " and et.LotId=:LotId ";
        repobj.LotId = LotId;
      }
      if (NotAgentPayment === 1) {
        sqlstring = sqlstring + " and et.NotAgentPayment IS NOT Null ";
      }
      if (NotAgentPayment === 0) {
        sqlstring = sqlstring + " and et.NotAgentPayment IS Null ";
      }
      if (
        SchemeRegId !== null &&
        SchemeRegId !== undefined &&
        SchemeRegId !== ""
      ) {
        sqlstring = sqlstring + " and sr.Id=:SchemeRegId ";
        repobj.SchemeRegId = SchemeRegId;
      }
      if (
        req.body.LoggerBranchId !== "" &&
        req.body.LoggerBranchId !== null &&
        req.body.LoggerBranchId !== -1 &&
        req.body.LoggerBranchId !== undefined &&
        req.body.SuperUserType !== 1
      ) {
        sqlstring = sqlstring + " and um.BranchId=:bid ";
        repobj.bid = req.body.LoggerBranchId;
      }
      sqlstring = sqlstring + " order by et.createdAt desc";
      console.log(sqlstring, "here is my sql");
      const myquery = await sq
        .query(sqlstring, { replacements: repobj, type: QueryTypes.SELECT })
        .then(async (rst) => {
          // console.log(rst, "hei o maro");
          var arr = [];
          if (rst.length !== 0) {
            rst.map((i) => {
              var ExpectedCollection = 0;
              var Commission = 0;
              var red = 0;
              var date = moment(i?.SchemeStartDate);
              var finaldate = date.add(i?.duration, "months");
              var numDays = finaldate.diff(date, "days");
              if (i?.PaymentType === 2) {
                ExpectedCollection = i?.EMI;
                if (ExpectedCollection > i?.totcolection) {
                  red = 1;
                } else {
                  red = 0;
                }
                Commission = Math.floor(
                  (i?.totcolection * i?.Commission) / 100
                );
              } else {
                ExpectedCollection = i?.Regfees;
              }

              arr.push({
                ...i,
                ExpectedCollection: ExpectedCollection,
                red: red,
                Commission: Commission,
              });
            });

            return res.status(200).json({
              errMsg: true,
              response: arr,
            });
          } else {
            return res.status(200).json({
              errMsg: true,
              response: [],
              message: "No Data exists",
            });
          }
        })
        .catch((err) => {
          console.log(err, "ho");
          return res
            .status(err?.status || 500)
            .json({ status: "FAILED", response: err });
        });
      return myquery;
    } catch (error) {
      console.log(error);
      return res.status(error?.status || 500).json({
        status: "FAILED",
        response: { error: error?.message || error },
      });
    }
  }

  async MonthlyPayment(req, res, next) {
    try {
      var SchemeRegId;
      if (
        req.body.SchemeRegId !== "" &&
        req.body.SchemeRegId !== null &&
        req.body.SchemeRegId !== undefined
      ) {
        console.log("sch");
        SchemeRegId = req.body.SchemeRegId;
      }
      console.log(req.body, "Month", req.body.SchemeRegId, SchemeRegId);
      MonthlyTrans.findAll({
        where: {
          SchemeRegId: SchemeRegId,
        },
      })
        .then(async (rst) => {
          console.log(rst);
          if (rst.length !== 0) {
            return res.status(200).json({ errmsg: false, response: rst });
          } else {
            return res.status(200).json({
              errMsg: true,
              response: [],
              message: "No Data exists",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(err?.status || 500)
            .json({ status: "FAILED", data: { error: err?.message || err } });
        });
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async WalletBalance(req, res, next) {
    try {
      var SchemeRegId;
      if (
        req.body.SchemeRegId !== "" &&
        req.body.SchemeRegId !== null &&
        req.body.SchemeRegId !== undefined
      ) {
        SchemeRegId = req.body.SchemeRegId;
      }

      sq.query(
        "SELECT SUM(WalletBalance) as Wallet FROM monthlytrans where SchemeRegId=:SchemeRegId",
        {
          replacements: { SchemeRegId: SchemeRegId },
          type: QueryTypes.SELECT,
        }
      )
        .then(async (rst) => {
          if (rst.length !== 0) {
            return res.status(200).json({ errmsg: false, response: rst });
          } else {
            return res.status(200).json({
              errMsg: true,
              response: [],
              message: "No Data exists",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(err?.status || 500)
            .json({ status: "FAILED", data: { error: err?.message || err } });
        });
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new Custdetailpayment();
