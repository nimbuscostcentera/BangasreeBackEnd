const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
// const { CustomerPayments } = require("../Model/AgentCollection.Model");
const { Op } = require("sequelize");

class CollectionViewService {
  async CustomerCollectionShow(req, res, next) {
    try {
      console.log(req.body, "in show service");
      var obj = {};
      var date = new Date();
      console.log(date);
      var i;
      var Due = "";
      var MaturityStatus = "";
      var BonusStatus = "";
      var AgentCode = "";
      var customerid = "";
      var dt = "";
      var TimeToMature="";
      const { CompanyCode } = req.body;
      if (
        req.body.Due != "" &&
        req.body.Due != null &&
        req.body.Due != undefined
      ) {
        Due = req.body.Due;
      }
      if (
        req.body.MaturityStatus != "" &&
        req.body.MaturityStatus != null &&
        req.body.MaturityStatus != undefined
      ) {
        MaturityStatus = req.body.MaturityStatus;
      }
      if (req.body.MaturityStatus == 0) {
        MaturityStatus = req.body.MaturityStatus;
      }
      if (
        req.body.CollDate != "" &&
        req.body.CollDate != null &&
        req.body.CollDate != undefined
      ) {
        dt = req.body.CollDate;
      }
      if (
        req.body.BonusStatus != "" &&
        req.body.BonusStatus != null &&
        req.body.BonusStatus != undefined 
      ) {
        console.log("hello tri");
        BonusStatus = req.body.BonusStatus;
      }
      if (req.body.BonusStatus == 0) {
        console.log("hello tri");
        BonusStatus = req.body.BonusStatus;
      }
      if (
        req.body.AgentCode != "" &&
        req.body.AgentCode != null &&
        req.body.AgentCode != undefined
      ) {
        AgentCode = req.body.AgentCode;
      }
      if (req.body.TimeToMature !="" && req.body.TimeToMature !=null && req.body.TimeToMature !=undefined  )
      {
        TimeToMature =req.body.TimeToMature
      } 
      if (
        req.body.CustomerID != "" &&
        req.body.CustomerID != null &&
        req.body.CustomerID != undefined
      ) {
        customerid = req.body.CustomerID;
      }
     var sql="";
     var repobj = {};
     sql="SELECT et.CollectionId,et.CollectionUUId,cm.CustomerName,sm.SchemeTitle,sum(et.CollectedAmt) as totcolection,max(et.CollDate) as lastDate,sr.SUUid,sr.StartDate,sr.EMI,sr.frequency,cm.AgentCode ,et.PaymentMode,et.PaymentStatus,et.ChqNO,et.ChqDate,et.MICR,et.TransactionId,et.ReceiptNo,sr.MaturityStatus,sr.BonusStatus,sr.BonusComment,sr.MaturityComment,et.SchemeRegId,sr.RedeemAmt,sr.CustomerAccNo  FROM `schemeregisters` as sr INNER JOIN customermasters as cm on sr.UUid=cm.UUid INNER JOIN schememasters as sm on sm.SUUid=sr.SUUid INNER JOIN emitrans as et on et.SchemeRegId=sr.ID and et.PaymentType=2"
      if (MaturityStatus !== "" && MaturityStatus !==-1) {

        sql=sql+ " and   sr.MaturityStatus=:MaturityStatus "
        repobj.MaturityStatus = MaturityStatus;

      } 
      if (BonusStatus !== "" &&   BonusStatus !== -1) {
        console.log(BonusStatus);
        sql=sql+ " and  sr.BonusStatus=:BonusStatus"
        repobj.BonusStatus = BonusStatus;
           
      } 
      if (AgentCode !== "") {
        console.log(AgentCode);
        sql=sql+ " and  cm.AgentCode=:AgentCode"
        repobj.AgentCode = AgentCode;

      } 
       if (TimeToMature != "") {
        sql=sql+ " and sr.EndDate<=:date"
        repobj.date = date;
     
      }
      if(customerid !=="")
      {
        sql=sql+ " and cm.CustomerID=:id "
        repobj.id = customerid;
      }
       sql=sql+" GROUP by sr.id"
        const Custsw = await sq
          .sync()
          .then(async () => {
            console.log("service1 ok else ", MaturityStatus);
            sq.query(sql, { replacements: repobj, type: QueryTypes.SELECT }).then(async (rst) => {
              console.log("in rst");
              console.log("test", rst);
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
                  if (rst[i].frequency == "Daily") {
                    var StartDate = new Date(rst[i].StartDate);
                    var enddate = new Date();
                 
                    const diffTime = Math.abs(enddate - StartDate);
                    var diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    diffDays=diffDays+1
                    if (diffDays > 0) {
                      amttobepaid = rst[i].EMI * diffDays;
                    } else {
                      amttobepaid = rst[i].EMI;
                    }
                  }
                  if (rst[i].frequency == "Monthly") {
                    var StartDate = new Date(rst[i].StartDate);

                    var enddate = new Date();
                    const monthDiff = (enddate.getMonth() - StartDate.getMonth())+1;
                    // console.log(monthDiff,enddate.getMonth(),StartDate.getMonth());
                    // monthDiff= monthDiff+1
                    if (monthDiff > 0) {
                      amttobepaid = rst[i].EMI * monthDiff;
                    } else {
                      amttobepaid = rst[i].EMI;
                    }
                  }
                  if (rst[i].frequency == "Yearly") {
                    var StartDate = new Date(rst[i].StartDate);
                    var enddate = new Date();
                    var yearDiff = enddate.getYear() - StartDate.getYear();
                    yearDiff=yearDiff+1
                    if (yearDiff > 0) {
                      amttobepaid = rst[i].EMI * yearDiff;
                    } else {
                      amttobepaid = rst[i].EMI;
                    }
                  }
                  // console.log(amttobepaid,"amt");
                  //console.log(rst[i].totcolection);
                  rstobj.amttobepaid = amttobepaid;
                  if (amttobepaid > rst[i].totcolection) {
                    red = 1;

                    dueobj = rst[i];
                    dueobjred.totcollected = rst[i].totcolection;
                    dueobjred.red = red;
                  } else {
                    red = 0;
                  }
                  rstobj.red = red;
                  rstobj.totcollected = rst[i].totcolection;
                  rstobj.PaybaleAmt = amttobepaid;
                  if (Due == 1) {
                    finalrst = { ...dueobj, ...dueobjred };
                  } else {
                    finalrst = { ...rst[i], ...rstobj };
                  }
                  arr.push(finalrst);
                }
                console.log(arr,"check");
                return res.status(200).json({ errmsg: false, response: arr });
              } else {
                console.log(arr,"in else");
                return res.status(200).json({
                  errMsg: true,
                  response: arr,
                  message: "No Data exists",
                });
              }
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errmsg: true, response: err });
          });
      
      // return Custsw;
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new CollectionViewService();
