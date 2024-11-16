const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
// const { CustomerPayments } = require("../Model/AgentCollection.Model");
const { Op } = require("sequelize");

class CollectionViewService {
  
  async CustomerCollectionShow(req, res, next) {
    try {
      console.log("in show service")
    //   var obj = {};
    //   console.log("all");
    //   console.log(req.body);

      // if (req.body.startDate != null && req.body.endDate != null) {
      //   startDate = req.body.startDate;
      //   enddate = req.body.endDate;
      //   obj.createdAt = { [Op.between]: [startDate, enddate] };
      // }
      var obj={};
      
      var i;
      var Due="";
      var MaturityStatus="";
      var BonusStatus="";
      var AgentCode="";
      var customerid="";
      var dt="";
      const {
        CompanyCode,
      } = req.body;  
      if (req.body.Due !="" && req.body.Due !=null && req.body.Due !=undefined  )
      {
        Due =req.body.Due
      }
      if (req.body.MaturityStatus !="" && req.body.MaturityStatus !=null && req.body.MaturityStatus !=undefined  )
      {
         MaturityStatus=req.body.MaturityStatus
      }
      if (req.body.CollDate !="" && req.body.CollDate !=null && req.body.CollDate !=undefined  )
      {
        dt=req.body.CollDate
      }
      if (req.body.BonusStatus !="" && req.body.BonusStatus !=null && req.body.BonusStatus !=undefined  )
      {
        BonusStatus=req.body.BonusStatus
      }    
      if (req.body.AgentCode !="" && req.body.AgentCode !=null && req.body.AgentCode !=undefined  )
      {
       AgentCode=req.body.AgentCode
      }      
      if(MaturityStatus!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,sum(et.CollectedAmt) as totcolection,max(et.CollDate) as lastDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and   sr.MaturityStatus=:MaturityStatus  GROUP by et.CustomerUUid ",
            {
              replacements: { MaturityStatus: MaturityStatus },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            console.log(rst);

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) {
                    amttobepaid = rst[i].EmiAmt * diffDays;
                  } else {
                    amttobepaid = rst[i].EmiAmt;
                  }
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  if (monthDiff > 0) {
                    amttobepaid = rst[0].EmiAmt * monthDiff;
                  } else {
                    amttobepaid = rst[0].EmiAmt;
                  }

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  if (yearDiff > 0) {
                    amttobepaid = rst[i].EmiAmt * yearDiff;
                  } else {
                    amttobepaid = rst[i].EmiAmt;
                  }
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;

                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
  
          // AgentCollectins.findAll({where: obj || 1,}).then(async(finalRes)=>{
          //             if (finalRes.length != 0)
          //             {
          //                 return res
          //                 .status(200)
          //                 .json({ errmsg: false, response: finalRes });
          //             }
          //             else{
          //                 return res
          //                 .status(400)
          //                 .json({ errMsg: true, message: "There is no scheme exists" });   
          //             }
          //         })
          // const users =  AgentMasters.findAll();
              
        });
      }
      else if(BonusStatus!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,sum(et.CollectedAmt) as totcolection,max(et.CollDate) as lastDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and  sr.BonusStatus=:BonusStatus  GROUP by et.CustomerUUid ",
            {
              replacements: { BonusStatus: BonusStatus },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            console.log(rst);

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};

              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) {
                    amttobepaid = rst[i].EmiAmt * diffDays;
                  } else {
                    amttobepaid = rst[i].EmiAmt;
                  }
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  if (monthDiff > 0) {
                    amttobepaid = rst[0].EmiAmt * monthDiff;
                  } else {
                    amttobepaid = rst[0].EmiAmt;
                  }

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  if (yearDiff > 0) {
                    amttobepaid = rst[i].EmiAmt * yearDiff;
                  } else {
                    amttobepaid = rst[i].EmiAmt;
                  }
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(AgentCode!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,sum(et.CollectedAmt) as totcolection,max(et.CollDate) as lastDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and  cm.AgentCode=:AgentCode GROUP by et.CustomerUUid  ",
            {
              replacements: { AgentCode: AgentCode },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            console.log(rst);

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  if (yearDiff>0)
                  {
                    amttobepaid = rst[i].EmiAmt * yearDiff;
                  }
                  else
                  {
                    amttobepaid = rst[i].EmiAmt ;
                  }
                  
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;

                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(dt!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,max(et.CollDate) lastDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and  et.CollDate<=:Date  GROUP by et.CustomerUUid",
            {
              replacements: { Date: dt },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            console.log(rst);

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0)
                  {
                    amttobepaid = rst[i].EmiAmt * diffDays;  
                  }
                  else
                  {
                    amttobepaid = rst[i].EmiAmt;
                    }
                  
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(AgentCode!="" && BonusStatus!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and   cm.AgentCode=:AgentCode cr.BonusStatus=:BonusStatus ",
            {
              replacements: { AgentCode: AgentCode, BonusStatus: BonusStatus },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(AgentCode!="" && MaturityStatus!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and  cm.AgentCode=:AgentCode cr.MaturityStatus=:MaturityStatus ",
            {
              replacements: {
                AgentCode: AgentCode,
                MaturityStatus: MaturityStatus,
              },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(BonusStatus!="" && MaturityStatus!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and   cr.BonusStatus=:BonusStatus cr.MaturityStatus=:MaturityStatus ",
            {
              replacements: {
                BonusStatus: BonusStatus,
                MaturityStatus: MaturityStatus,
              },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(AgentCode!="" && MaturityStatus!="" && BonusStatus!="" )
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and  cm.AgentCode=:AgentCode  cr.MaturityStatus=:MaturityStatus and cr.BonusStatus=:BonusStatus ",
            {
              replacements: {
                AgentCode: AgentCode,
                MaturityStatus: MaturityStatus,
                BonusStatus: BonusStatus,
              },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};

                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(AgentCode!="" && BonusStatus!="" && dt!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId, cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and   cm.AgentCode=:AgentCode cr.BonusStatus=:BonusStatus and Date<=:Date ",
            {
              replacements: {
                Date: dt,
                AgentCode: AgentCode,
                BonusStatus: BonusStatus,
              },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;

                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(AgentCode!="" && MaturityStatus!="" && dt!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and  cm.AgentCode=:AgentCode cr.MaturityStatus=:MaturityStatus and et.CollDate<=:Date ",
            {
              replacements: {
                Date: dt,
                AgentCode: AgentCode,
                MaturityStatus: MaturityStatus,
              },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};

                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;

                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(BonusStatus!="" && MaturityStatus!="" && dt!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,et.CollectedAmt as totcolection,et.CollDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and   cr.BonusStatus=:BonusStatus cr.MaturityStatus=:MaturityStatus and et.CollDate<=:Date ",
            {
              replacements: {
                Date: dt,
                BonusStatus: BonusStatus,
                MaturityStatus: MaturityStatus,
              },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  amttobepaid = rst[i].EmiAmt * diffDays;
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;

                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else if(AgentCode!="" && MaturityStatus!="" && BonusStatus!="" && dt!="")
      {
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,sum(et.CollectedAmt) as totcolection,max(et.CollDate) as lastDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode and  cm.AgentCode=:AgentCode  cr.MaturityStatus=:MaturityStatus and cr.BonusStatus=:BonusStatusa and et.CollDate<=:Date  GROUP by et.CustomerUUid",
            {
              replacements: {
                Date: dt,
                AgentCode: AgentCode,
                MaturityStatus: MaturityStatus,
                BonusStatus: BonusStatus,
              },
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            // console.log(rst) ;

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};

              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};
                var red = 0;
                if (i >= 1) {
                  console.log(i);
                  var j = i - 1;
                  if ((rst[i].SUUid = rst[j].SUUid)) {
                    tot = rst[i].totcolection + tot;
                  } else {
                    tot = rst[i].totcolection;
                  }
                } else {
                  tot = rst[i].totcolection;
                }

                console.log(rst);
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0)
                  {
                     amttobepaid = rst[i].EmiAmt * diffDays;
                  } 
                  else {
                      amttobepaid = rst[i].EmiAmt ;
                  }
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();

                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  amttobepaid = rst[0].EmiAmt * monthDiff;

                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  amttobepaid = rst[i].EmiAmt * yearDiff;
                }
                console.log(amttobepaid);
                console.log(rst[i].CollectedAmt);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > tot) {
                  console.log("red");
                  red = 1;
                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
        });
      }
      else{
        const Custsw = await sq.sync().then(async () => {
          console.log("service1 ok else");
          sq.query(
            "SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,sum(et.CollectedAmt) as totcolection,max(et.CollDate) as lastDate,sr.SUUid,sm.DurationType,sr.StartDate,sm.EmiAmt,am.AgentCode ,am.Name,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus  from customermasters as cm,schememasters as sm ,schemeregisters as sr,emitrans as et,agentmasters as am where sr.UUid=cm.UUid and sr.SUUid = sm.SUUid and et.SUUid=sr.SUUid and et.CustomerUUid=sr.UUid and cm.AgentCode=am.Agentcode GROUP by et.CustomerUUid ",
            {
              type: QueryTypes.SELECT,
            }
          ).then(async (rst) => {
            console.log(rst,"to1");

            var arr = [];
            if (rst.length != 0) {
              var finalrst = {};
              var length1 = rst.length;
              var amttobepaid;
              var tot = 0;
              for (i = 0; i < length1; i++) {
                var rstobj = {};
                var dueobj = {};
                var dueobjred = {};

                var red = 0;
                // if (i >= 1) {
                //   console.log(i);
                //   var j = i - 1;
                //   if ((rst[i].SUUid = rst[j].SUUid)) {
                //     tot = rst[i].totcolection + tot;
                //   } else {
                //     tot = rst[i].totcolection;
                //   }
                // } else {
                //   tot = rst[i].totcolection;
                // }

                console.log(rst,"result to check");
                if (rst[i].DurationType == "Days") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  cons;
                  const diffTime = Math.abs(enddate - StartDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0)
                  { 
                    amttobepaid = rst[i].EmiAmt * diffDays;
                  } 
                  else {
                    amttobepaid = rst[i].EmiAmt ;
                  }
                  
                }
                if (rst[i].DurationType == "Months") {
                  console.log("flag");
                  console.log(new Date());
                  var StartDate = new Date(rst[i].StartDate);

                  var enddate = new Date();
                  console.log(enddate.getMonth(),"end month", StartDate.getMonth(),"start");
                  const monthDiff = enddate.getMonth() - StartDate.getMonth();
                  if (monthDiff > 0)
                  {
                    amttobepaid = rst[i].EmiAmt * monthDiff;
                  }
                  else
                  {
                    amttobepaid = rst[i].EmiAmt ;
                    }
                 
                  console.log(amttobepaid,rst[i].EmiAmt,monthDiff,"in months ");
                  // console.log(monthDiff); // 29
                  // console.log(diffDays); // 29
                  // console.log(yearDiff); // 29
                }
                if (rst[i].DurationType == "Years") {
                  var StartDate = new Date(rst[i].StartDate);
                  var enddate = new Date();
                  const yearDiff = enddate.getYear() - StartDate.getYear();
                  if (yearDiff > 0)
                  {
                    amttobepaid = rst[i].EmiAmt * yearDiff;
                  }  
                  else {
                    amttobepaid = rst[i].EmiAmt;
                  }
                }
                console.log(amttobepaid,"amt");
                console.log(rst[i].totcolection);
                rstobj.amttobepaid = amttobepaid;
                if (amttobepaid > rst[i].totcolection) {
                  red = 1;

                  dueobj = rst[i];
                  dueobjred.totcollected = tot;
                  dueobjred.red = red;
                } else {
                  red = 0;
                }
                rstobj.red = red;
                rstobj.totcollected = tot;
                rstobj.PaybaleAmt = amttobepaid;
                if (Due == 1) {
                  finalrst = { ...dueobj, ...dueobjred };
                } else {
                  finalrst = { ...rst[i], ...rstobj };
                }
                arr.push(finalrst);
              }
              console.log(arr);
              return res.status(200).json({ errmsg: false, response: arr });
            } else {
              return res
                .status(400)
                .json({ errMsg: true, message: "No Data exists" });
            }
          });
  
          // AgentCollectins.findAll({where: obj || 1,}).then(async(finalRes)=>{
          //             if (finalRes.length != 0)
          //             {
          //                 return res
          //                 .status(200)
          //                 .json({ errmsg: false, response: finalRes });
          //             }
          //             else{
          //                 return res
          //                 .status(400)
          //                 .json({ errMsg: true, message: "There is no scheme exists" });   
          //             }
          //         })
          // const users =  AgentMasters.findAll();
              
        });
      }
      // return Custsw;
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }

}
module.exports = new CollectionViewService();
