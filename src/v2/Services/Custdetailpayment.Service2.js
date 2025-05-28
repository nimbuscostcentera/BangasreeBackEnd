const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { MonthlyTrans } = require("../Model/MonthlyTrans.Model");
// const { CustomerPayments } = require("../Model/AgentCollection.Model");
const { Op } = require("sequelize");
const moment = require("moment");
class Custdetailpayment {
  // async CustomerPaymentShow(req, res, next) {
  //   try {
  //     var PaymentStatus = "";
  //     console.log(req.body,"in show service");
  //     var obj = {};
  //     var i;
  //     var Due = "";
  //     var MaturityStatus = "";
  //     var BonusStatus = "";
  //     var AgentCode = "";
  //     var CustomerID = "";
  //     var dt1 = "";
  //     var dt2 = "";
  //     var CollectionId="";
  //     var NotAgentPayment="";
  //  var time1 = "23:59:59";
  //  var time = "00:00:00";
  //     const { CompanyCode } = req.body;
  //     console.log(req.body, "in Service of custPay");
  //     var SchemeRegId = req.body.SchemeRegId||"";
  //     if (
  //       req.body.Due != "" &&
  //       req.body.Due != null &&
  //       req.body.Due != undefined
  //     ) {
  //       Due = req.body.Due;
  //     }
  //     if (
  //       req.body.startDate != "" &&
  //       req.body.startDate != null &&
  //       req.body.startDate != undefined
  //     ) {
  //       console.log(req.body);
  //       var dt = req.body.startDate;
  //        dt1 = `${dt} ${time}`;
  //     }
  //     if (
  //       req.body.endDate != "" &&
  //       req.body.endDate != null &&
  //       req.body.endDate != undefined
  //     ) {
  //      var dte = req.body.endDate;
  //        dt2 = `${dte} ${time1}`;
  //     }
  //     if (
  //       req.body.AgentCode != "" &&
  //       req.body.AgentCode != null &&
  //       req.body.AgentCode != undefined
  //     ) {
  //       AgentCode = req.body.AgentCode;
  //     }
  //     if (
  //       req.body.CustomerID != "" &&
  //       req.body.CustomerID != null &&
  //       req.body.CustomerID != undefined &&  SchemeRegId==""
  //     ) {
  //       CustomerID = req.body.CustomerID;
  //       console.log("IfDF", CustomerID);
  //     }
  //     if (
  //       req.body.PaymentStatus != "" &&
  //       req.body.PaymentStatus != null &&
  //       req.body.PaymentStatus != undefined
  //     ) {
  //       PaymentStatus = req.body.PaymentStatus;
  //     }
  //     if(
  //       req.body.CollectionId != "" &&
  //       req.body.CollectionId != null &&
  //       req.body.CollectionId != undefined
  //     )
  //     {
  //        CollectionId=req.body.CollectionId;
  //     }
  //     if(
  //       req.body.NotAgentPayment != "" &&
  //       req.body.NotAgentPayment != null &&
  //       req.body.NotAgentPayment != undefined
  //     )
  //     {
  //       NotAgentPayment=req.body.NotAgentPayment;
  //     }
  //     console.log("dt1", dt1, " : ", "dt2:", dt2);
      
      
  //     if (AgentCode != "" && dt1=='' && dt2=='' && NotAgentPayment=="") {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok", AgentCode);
  //         sq.query(
  //           "SELECT et.PaymentType ,et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,sr.CustomerAccNo,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid  and  cm.AgentCode=:AgentCode order by et.colldate desc",
  //           {
  //             replacements: { AgentCode: AgentCode },
  //             type: QueryTypes.SELECT,
  //           }
  //         )
  //           .then(async (rst) => {
  //             console.log(rst.length);

  //             var arr = [];
        
  //               var finalrst = {};
  //               var length1 = rst.length;
  //               var amttobepaid;
  //               var tot = 0;

  //               console.log(arr);
  //               return res.status(200).json({ errmsg: false, response: rst });

  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       });
  //     }
  //     else if (dt1 != "" && dt2 != "" && AgentCode == "" && PaymentStatus === "" && NotAgentPayment=="") {
  //       console.log("date asche", dt1, dt2);
  //       const Custsw = await sq.sync().then(async () => {
  //         sq.query(
  //           "SELECT et.PaymentType ,et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,sr.CustomerAccNo,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  et.CollDate between :dt1 and :dt2 order by et.colldate",
  //           {
  //             replacements: { dt1: dt1, dt2: dt2 },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst,"Check date");

  //           var arr = [];

  //           console.log(arr);
  //           return res.status(200).json({ errmsg: false, response: rst });
  //         });
  //       });
  //     }
  //     else if (CustomerID != "" && SchemeRegId == "") {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("customid get here");
  //         sq.query(
  //           "SELECT et.PaymentType ,et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,sr.CustomerAccNo,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  cm.CustomerID=:CustomerID order by et.colldate",
  //           {
  //             replacements: { CustomerID: CustomerID },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);

  //           var arr = [];

  //           var finalrst = {};
  //           var length1 = rst.length;
  //           var amttobepaid;
  //           var tot = 0;

  //           console.log(arr);
  //           return res.status(200).json({ errmsg: false, response: rst });
  //         });
  //       });
  //     }
  //     else if (PaymentStatus != "" && dt1 == "" && dt2 == "" && NotAgentPayment=="") {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("customid get here");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.ID as SchemeRegId ,sr.CustomerAccNo ,  et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and et.paymentstatus=:paymentstatus ",
  //           {
  //             replacements: { paymentstatus: PaymentStatus },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);

  //           var arr = [];
  //           if (rst.length != 0) {
  //             var finalrst = {};
  //             var length1 = rst.length;
  //             var amttobepaid;
  //             var tot = 0;
  //             for (i = 0; i < length1; i++) {
  //               var rstobj = {};
  //               var dueobj = {};
  //               var dueobjred = {};
  //               var red = 0;
  //               if (i >= 1) {
  //                 console.log(i);
  //                 var j = i - 1;
  //                 if ((rst[i].SUUid = rst[j].SUUid)) {
  //                   tot = rst[i].totcolection + tot;
  //                 } else {
  //                   tot = rst[i].totcolection;
  //                 }
  //               } else {
  //                 tot = rst[i].totcolection;
  //               }

  //               console.log(rst);
  //               if (rst[i].DurationType == "Days") {
  //                 var StartDate = new Date(rst[i].StartDate);
  //                 var enddate = new Date();
  //                 const diffTime = Math.abs(enddate - StartDate);
  //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //                 amttobepaid = rst[i].EmiAmt * diffDays;
  //               }
  //               if (rst[i].DurationType == "Months") {
  //                 console.log("flag");
  //                 var StartDate = new Date(rst[i].StartDate);

  //                 var enddate = new Date();

  //                 const monthDiff = enddate.getMonth() - StartDate.getMonth();
  //                 amttobepaid = rst[0].EmiAmt * monthDiff;

  //                 // console.log(monthDiff); // 29
  //                 // console.log(diffDays); // 29
  //                 // console.log(yearDiff); // 29
  //               }
  //               if (rst[i].DurationType == "Years") {
  //                 var StartDate = new Date(rst[i].StartDate);
  //                 var enddate = new Date();
  //                 const yearDiff = enddate.getYear() - StartDate.getYear();
  //                 amttobepaid = rst[i].EmiAmt * yearDiff;
  //               }
  //               console.log(amttobepaid);
  //               console.log(rst[i].CollectedAmt);
  //               rstobj.amttobepaid = amttobepaid;
  //               if (amttobepaid > tot) {
  //                 console.log("red");
  //                 red = 1;
  //                 dueobj = rst[i];
  //                 dueobjred.totcollected = tot;
  //                 dueobjred.red = red;
  //               } else {
  //                 red = 0;
  //               }
  //               rstobj.red = red;
  //               rstobj.totcollected = tot;
  //               if (Due == 1) {
  //                 finalrst = { ...dueobj, ...dueobjred };
  //               }
  //               else {
  //                 finalrst = { ...rst[i], ...rstobj };
  //               }
  //               arr.push(finalrst);
  //             }
  //             console.log(arr);
  //             return res.status(200).json({ errmsg: false, response: arr });
  //           }
  //           else {
  //             return res.status(200).json({
  //               errMsg: true,
  //               response: [],
  //               message: "No Data exists",
  //             });
  //           }
  //         });
  //       });
  //     }
  //     else if (PaymentStatus != "" && dt1 != "" && dt2 != "" && NotAgentPayment=="") {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("customid get here");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.ID as SchemeRegId ,sr.CustomerAccNo ,  et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and et.paymentstatus=:paymentstatus and et.CollDate between :dt1 and :dt2 order by et.CollDate",
  //           {
  //             replacements: {
  //               paymentstatus: PaymentStatus,
  //               dt1: dt1,
  //               dt2: dt2,
  //             },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst, "mujahudin");

  //           var arr = [];
  //           if (rst.length != 0) {
  //             var finalrst = {};
  //             var length1 = rst.length;
  //             var amttobepaid;
  //             var tot = 0;
  //             for (i = 0; i < length1; i++) {
  //               var rstobj = {};
  //               var dueobj = {};
  //               var dueobjred = {};
  //               var red = 0;
  //               if (i >= 1) {
  //                 console.log(i);
  //                 var j = i - 1;
  //                 if ((rst[i].SUUid = rst[j].SUUid)) {
  //                   tot = rst[i].totcolection + tot;
  //                 } else {
  //                   tot = rst[i].totcolection;
  //                 }
  //               } else {
  //                 tot = rst[i].totcolection;
  //               }

  //               console.log(rst);
  //               if (rst[i].DurationType == "Days") {
  //                 var StartDate = new Date(rst[i].StartDate);
  //                 var enddate = new Date();
  //                 const diffTime = Math.abs(enddate - StartDate);
  //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //                 amttobepaid = rst[i].EmiAmt * diffDays;
  //               }
  //               if (rst[i].DurationType == "Months") {
  //                 console.log("flag");
  //                 var StartDate = new Date(rst[i].StartDate);

  //                 var enddate = new Date();

  //                 const monthDiff = enddate.getMonth() - StartDate.getMonth();
  //                 amttobepaid = rst[0].EmiAmt * monthDiff;

  //                 // console.log(monthDiff); // 29
  //                 // console.log(diffDays); // 29
  //                 // console.log(yearDiff); // 29
  //               }
  //               if (rst[i].DurationType == "Years") {
  //                 var StartDate = new Date(rst[i].StartDate);
  //                 var enddate = new Date();
  //                 const yearDiff = enddate.getYear() - StartDate.getYear();
  //                 amttobepaid = rst[i].EmiAmt * yearDiff;
  //               }
  //               console.log(amttobepaid);
  //               console.log(rst[i].CollectedAmt);
  //               rstobj.amttobepaid = amttobepaid;
  //               if (amttobepaid > tot) {
  //                 console.log("red");
  //                 red = 1;
  //                 dueobj = rst[i];
  //                 dueobjred.totcollected = tot;
  //                 dueobjred.red = red;
  //               } else {
  //                 red = 0;
  //               }
  //               rstobj.red = red;
  //               rstobj.totcollected = tot;
  //               if (Due == 1) {
  //                 finalrst = { ...dueobj, ...dueobjred };
  //               } else {
  //                 finalrst = { ...rst[i], ...rstobj };
  //               }
  //               arr.push(finalrst);
  //             }
  //             console.log(arr);
  //             return res.status(200).json({ errmsg: false, response: arr });
  //           } else {
  //             return res.status(200).json({
  //               errMsg: true,
  //               response: [],
  //               message: "No Data exists",
  //             });
  //           }
  //         });
  //       });
  //     }
  //     else if (AgentCode != "" && dt1 != "" && dt2 != "" && NotAgentPayment=="") {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok");
  //         sq.query(
  //           "SELECT et.PaymentType ,et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,sr.CustomerAccNo,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid  and  cm.AgentCode=:AgentCode and et.CollDate between :dt1 and :dt2 order by et.colldate",
  //           {
  //             replacements: {
  //               dt1: dt1,
  //               dt2: dt2,
  //               AgentCode: AgentCode,
  //             },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);

  //           var finalrst = {};

  //           var length1 = rst.length;
  //           var amttobepaid;
  //           var tot = 0;

  //           return res.status(200).json({ errmsg: false, response: rst });
  //         });
  //       });
  //     }
  //     else if (
  //       SchemeRegId != "" &&
  //       SchemeRegId != null &&
  //       SchemeRegId != undefined
  //     ) {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.CustomerAccNo , et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  sr.SchemeRegId=:SchemeRegId order by et.colldate",
  //           {
  //             replacements: {
  //               SchemeRegId: SchemeRegId,
  //             },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);
  //           if (rst.length !== 0) {
  //             return res.status(200).json({ errmsg: false, response: rst });
  //           } else {
  //             return res
  //               .status(200)
  //               .json({ errmsg: false, response: [], msg: "No data Found" });
  //           }
  //         });
  //       });
  //     } 
  //     else if (
  //       NotAgentPayment == 1 &&  AgentCode == ""  && dt1 == "" && dt2 == ""
  //     ) {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.CustomerAccNo , et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  et.NotAgentPayment IS NOT NULL order by et.colldate",
  //           {
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);
  //           if (rst.length !== 0) {
  //             return res.status(200).json({ errmsg: false, response: rst });
  //           } else {
  //             return res
  //               .status(200)
  //               .json({ errmsg: false, response: [], msg: "No data Found" });
  //           }
  //         });
  //       });
  //     } 
  //     else if (
  //       NotAgentPayment == 0 &&  AgentCode == ""  && dt1 == "" && dt2 == ""
  //     ) {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.CustomerAccNo , et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  et.NotAgentPayment IS  NULL order by et.colldate",
  //           {
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);
  //           if (rst.length !== 0) {
  //             return res.status(200).json({ errmsg: false, response: rst });
  //           } else {
  //             return res
  //               .status(200)
  //               .json({ errmsg: false, response: [], msg: "No data Found" });
  //           }
  //         });
  //       });
  //     } 
  //     else if (
  //       NotAgentPayment == 1 &&  AgentCode != ""  && dt1 == "" && dt2 == ""
  //     ) {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.CustomerAccNo , et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  et.NotAgentPayment IS NOT NULL and and  cm.AgentCode=:AgentCode order by et.colldate",
  //           {
  //             replacements: {
  //               AgentCode: AgentCode,
  //             },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);
  //           if (rst.length !== 0) {
  //             return res.status(200).json({ errmsg: false, response: rst });
  //           } else {
  //             return res
  //               .status(200)
  //               .json({ errmsg: false, response: [], msg: "No data Found" });
  //           }
  //         });
  //       });
  //     } 
  //     else if (
  //       NotAgentPayment == 1 &&  AgentCode != ""  && dt1 != "" && dt2 != ""
  //     ) {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.CustomerAccNo , et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  et.NotAgentPayment IS NOT NULL and and  cm.AgentCode=:AgentCode and et.CollDate between :dt1 and :dt2 order by et.colldate",
  //           {
  //             replacements: {
  //               AgentCode: AgentCode,
  //               dt1: dt1,
  //               dt2: dt2,
  //             },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);
  //           if (rst.length !== 0) {
  //             return res.status(200).json({ errmsg: false, response: rst });
  //           } else {
  //             return res
  //               .status(200)
  //               .json({ errmsg: false, response: [], msg: "No data Found" });
  //           }
  //         });
  //       });
  //     } 
  //     else if(CollectionId !=""){

  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok");
  //         sq.query(
  //           "SELECT et.PaymentType ,sr.CustomerAccNo , et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,et.NotAgentPayment  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid and  et.CollectionId =:CollectionId order by et.colldate",
  //           {
  //             replacements: {
  //               CollectionId: CollectionId,
  //             },
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst,"CheckDateSort");
  //           if (rst.length !== 0) {
  //             return res.status(200).json({ errmsg: false, response: rst });
  //           } else {
  //             return res
  //               .status(200)
  //               .json({ errmsg: false, response: [], msg: "No data Found" });
  //           }
  //         });
  //       });
  //     }
  //     else {
  //       const Custsw = await sq.sync().then(async () => {
  //         console.log("service1 ok 12", req.body.CustomerID);
  //         sq.query(
  //           "SELECT et.PaymentType ,et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sr.StartDate,sr.EMI,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,sr.CustomerAccNo,et.NotAgentPayment from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SchemeRegId=sr.id and et.CustomerUUid=sr.UUid order by et.colldate desc",
  //           {
  //             type: QueryTypes.SELECT,
  //           }
  //         ).then(async (rst) => {
  //           console.log(rst);

  //           var arr = [];

  //           var finalrst = {};
  //           var length1 = rst.length;
  //           var amttobepaid;
  //           var tot = 0;

  //           //console.log(arr, "tridib");
  //           return res.status(200).json({ errmsg: false, response: rst });
  //         });

  //         // AgentCollectins.findAll({where: obj || 1,}).then(async(finalRes)=>{
  //         //             if (finalRes.length != 0)
  //         //             {
  //         //                 return res
  //         //                 .status(200)
  //         //                 .json({ errmsg: false, response: finalRes });
  //         //             }
  //         //             else{
  //         //                 return res
  //         //                 .status(400)
  //         //                 .json({ errMsg: true, message: "There is no scheme exists" });
  //         //             }
  //         //         })
  //         // const users =  AgentMasters.findAll();
  //       });
  //     }
  //     // return Custsw;
  //   }
  //   catch (error) {
  //     return res
  //       .status(error?.status || 500)
  //       .json({ status: "FAILED", data: { error: error?.message || error } });
  //   }
  // }
  async CustomerPaymentShow(req, res, next) {
    console.log(req.body,"reqbody");
  try
  {
    const {
      Due = "",
      startDate = "",
      endDate = "",
      AgentCode = "",
      CustomerID = "",
      PaymentStatus = "",
      CollectionId = "",
      SchemeRegId = "",
      CompanyCode = "",
      PaymentType="",
    } = req.body;
    console.log(req.body, "in show service");
    // var PaymentStatus = '';
    // var obj = {};
    // var i;
    // var Due = '';
    // var MaturityStatus = '';
    // var BonusStatus = '';
    // var AgentCode = '';
    // var CustomerID = '';
    var NotAgentPayment=-1
    if ((req.body.NotAgentPayment !== '' && req.body.NotAgentPayment !== undefined && req.body.NotAgentPayment !==null) || req.body.NotAgentPayment ===0 )
    {
    console.log("in not agen",NotAgentPayment);
      NotAgentPayment=req.body.NotAgentPayment
    }
    console.log("in not agen",NotAgentPayment);
    var dt1 = '';
    var dt2 = '';
    // var CollectionId='';
    // var NotAgentPayment='';
    var time1 = "23:59:59";
    var time = "00:00:00";
    var repobj = {};
    var sqlstring =
      "SELECT et.PaymentType ,et.CollectionId,et.CollectionUUId,cm.CustomerName,cm.UUid as CustUUid,sm.SchemeTitle,sm.Duration,sm.Regfees,sm.createdAt as SchemeStartDate,sr.frequency,et.CollectedAmt " +
      " as totcolection, et.CollDate, sr.SUUid, sr.StartDate, sr.EMI, cm.AgentCode,am.Commision as Commission, et.PaymentMode, et.PaymentStatus,sr.ID, " +
      " et.MICR, et.TransactionId, sr.MaturityStatus, sr.BonusStatus, sr.CustomerAccNo, et.NotAgentPayment,Area.AreaName,Bm.BranchName from customermasters " +
      " as cm, schememasters as sm, schemeregisters as sr, emitrans as et,agentmasters as am,usermasters as um,areamasters as Area,branchmasters as Bm  where sr.UUid = cm.UUid and sr.SUUid = sm.SUUid and " +
      " et.SchemeRegId = sr.id and et.CustomerUUid = sr.UUid and cm.AgentCode=am.AgentCode and et.CustomerUUid=um.UUid and et.AreaID=Area.AreaID and um.BranchId=Bm.BranchId ";
    if (startDate != '' && endDate != '') {
      dt1 = `${startDate} ${time}`;
      dt2 = `${endDate} ${time1}`;
      sqlstring = sqlstring + " and et.CollDate between :dt1 and :dt2 ";
      repobj.dt1 = dt1;
      repobj.dt2= dt2
  
    }
    if (AgentCode != '') {
      sqlstring =sqlstring+ " and cm.AgentCode=:AgentCode ";
      repobj.AgentCode = AgentCode ;
    }
     if (PaymentType != "" && PaymentType != -1) {
       sqlstring = sqlstring + " and et.PaymentType=:PaymentType ";
       repobj.PaymentType = PaymentType;
     }
    if (CustomerID != '') {
      sqlstring =sqlstring+ " and cm.CustomerID=:CustomerID ";
      repobj.CustomerID = CustomerID;
    }
    if (PaymentStatus != "" && PaymentStatus !=-1) {
      sqlstring = sqlstring + " and et.paymentstatus=:paymentstatus ";
      repobj.paymentstatus = PaymentStatus;
    }
    if (CollectionId != '') {
      sqlstring =sqlstring+ " and et.CollectionId=:CollectionId ";
      repobj.CollectionId=CollectionId ;
    }
    if ((NotAgentPayment ==1)) {
      sqlstring =sqlstring + " and et.NotAgentPayment IS NOT Null ";
      // repobj.NotAgentPayment= NotAgentPayment ;
    }
    console.log(NotAgentPayment,"check");
    if (NotAgentPayment == 0  ) {
      console.log("in 0");
       sqlstring = sqlstring + " and et.NotAgentPayment IS Null ";
      //  repobj.NotAgentPayment = NotAgentPayment;
     }
    if (SchemeRegId != '') {
      sqlstring =sqlstring+ " and sr.Id=:SchemeRegId ";
      repobj.SchemeRegId= SchemeRegId;
    }
    if (
      req.body.LoggerBranchId != "" &&
      req.body.LoggerBranchId != null &&
      req.body.LoggerBranchId != -1 &&
      req.body.LoggerBranchId != undefined &&
      req.body.SuperUserType !== 1
    ) {
      sqlstring = sqlstring + " and um.BranchId=:bid ";
      repobj.bid = req.body.LoggerBranchId;
    }
    sqlstring = sqlstring + " order by et.createdAt desc";
    console.log(sqlstring,"here is my sql");
    const myquery = await sq.query(sqlstring, { replacements: repobj, type: QueryTypes.SELECT })
      .then(async (rst) => {
        console.log(rst,"hei o maro");
        
        var arr = [];
        if (rst.length != 0) {
          rst.map((i) => {
            var ExpectedCollection = 0;
            var Commission = 0;
            var red = 0;
            var date = moment(i?.SchemeStartDate);
            var finaldate = date.add(i?.duration,"months");
            var numDays = finaldate.diff(date, "days");
            if (i?.PaymentType == 2)
            {
              ExpectedCollection=i?.EMI;
              // if (i?.frequency == "Monthly") {
              //   ExpectedCollection = i?.EMI;
              // } else if (i?.frequency == "Daily") {
              //   ExpectedCollection = numDays * i?.EMI;
              // } else if (i?.frequency == "Weekly") {
              //   const numDays = moment(month, "MM-YYYY").daysInMonth();
              //   const noofweek = Math.floor(numDays / 7);
              //   ExpectedCollection = noofweek * i?.EMI;
              // }
              if (ExpectedCollection > i?.totcolection) {
                red = 1;
              }
              else {
                red = 0;
              }
              
                Commission = Math.floor((i?.totcolection * i?.Commission)/100);
             
            }
            else {
              ExpectedCollection = i?.Regfees;
            }
            
            arr.push({
              ...i,
              ExpectedCollection: ExpectedCollection,
              red: red,
              Commission:Commission});
          });
          
           return res.status(200).json({
             errMsg: true,
             response: arr
           });
        }
        else
        {
          return res.status(200).json({
            errMsg: true,
            response: [],
            message: "No Data exists",
          });
        }
      })
      .catch((err) => {
        console.log(err,"ho");
        return res
          .status(err?.status || 500)
          .json({ status: "FAILED", response: err });
      });
   return myquery;
  }
  catch (error)
  {
    console.log(error);
    return res
      .status(error?.status || 500)
      .json({ status: "FAILED", response: { error: error?.message || error } });
  }
}

  async MonthlyPayment(req,res,next){
    try{
      var SchemeRegId;
      if (
        req.body.SchemeRegId != "" &&
        req.body.SchemeRegId != null &&
        req.body.SchemeRegId != undefined
      ) {

        console.log("sch");
        SchemeRegId = req.body.SchemeRegId;
      }
      console.log(req.body,"Month",req.body.SchemeRegId,SchemeRegId);
      MonthlyTrans.findAll({
        where:{
          SchemeRegId:SchemeRegId
        }
      })
      .then(async (rst) => {
        console.log(rst);
        if(rst.length !=0)
        {

          // return res.status(200).json({ errmsg: false, response: rst });
          return res.status(200).json({ errmsg: false, response: rst });
        }
        else{
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
    }
    catch(error)
    {
      console.log(error);
      return res
      .status(error?.status || 500)
      .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async WalletBalance(req,res,next){

    try{
      var SchemeRegId;
      if (
        req.body.SchemeRegId != "" &&
        req.body.SchemeRegId != null &&
        req.body.SchemeRegId != undefined
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
        if(rst.length !=0)
        {
          return res.status(200).json({ errmsg: false, response: rst });
        }
        else{
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
    }
    catch(error)
    {
      return res
      .status(error?.status || 500)
      .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new Custdetailpayment();
