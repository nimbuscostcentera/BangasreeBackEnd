const { sq } = require("../../DataBase/ormdb");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { schemeregisterhistory } = require("../Model/SchemeRegisterHistory.Model");
const {MaturityCertificateMaster}=require("../Model/MaturityCertificateMaster.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const http = require('http');
class MaturityStatusService{
 
  async MaturityStatus(req, res, next) {
    try {
      console.log(req.body,"service");
      var Custsw;
      var val = "";
      var value = [];
      var matrureamt=0;
      var redeemamt=0;
      var withBonus=0;
      var waletbal=0;
      var flag=0;
      const { Status, CustomerID, UUid,SchemeRegId,Comment,LoggerID,CompanyCode } = req.body;
      // if (CustomerID?.length!=0) {
      //   val = "CustomerID";
      //   value = CustomerID;
      // }
      // else if (UUid?.length != 0) {
      //   val = "UUid";
      //   value = UUid;
      // }
      if(req.body.withBonus!='' && req.body.withBonus!=null && req.body.withBonus!='undefined' )
      {
        withBonus=req.body.withBonus;
      }
        if (UUid?.length != 0) {
          if (Status==3)
          {
                await sq
                .query(
                  `SELECT sum(mt.ActualCollection) collection,sum(mt.WalletBalance) as wallet,sm.BONUS,sr.MaturityStatus,sr.BonusStatus from monthlytrans as mt,schemeregisters as sr,schememasters as sm where mt.SchemeRegId=sr.ID and sm.SUUid=sr.SUUid and mt.SchemeRegId=:SchemeRegId `,
                  {
                    replacements: {SchemeRegId: SchemeRegId },
                    type: QueryTypes.SELECT,
                  }
                )
                .then(async (cal) => {
                  if(cal[0].MaturityStatus==0)
                  {
                    flag=1;
                  }
                  else
                  {
                  if(cal[0].BonusStatus==1)
                  {
                    matrureamt=cal[0].collection+((cal[0].collection*cal[0].BONUS)/100);
                  } 
                  else{
                    matrureamt=cal[0].collection;
                  }
                  waletbal=cal[0].wallet
                  redeemamt=matrureamt+cal[0].wallet;
                  console.log(cal[0].collection);
                }
                })
          }
          if (Status==2)
          {
                await sq
                .query(
                  `SELECT sum(mt.ActualCollection) collection,sum(mt.WalletBalance) as wallet,sm.BONUS,sr.MaturityStatus,sr.BonusStatus from monthlytrans as mt,schemeregisters as sr,schememasters as sm where mt.SchemeRegId=sr.ID and sm.SUUid=sr.SUUid and mt.SchemeRegId=:SchemeRegId `,
                  {
                    replacements: {SchemeRegId: SchemeRegId },
                    type: QueryTypes.SELECT,
                  }
                )
                .then(async (cal) => {
                  console.log(cal,"TEST143");
                  if(cal[0].MaturityStatus==0)
                  {
                    flag=1;
                  }
                  else
                  {
                  if(withBonus == 1)
                  {   
                    matrureamt=cal[0].collection+((cal[0].collection*cal[0].BONUS)/100);
                  } 
                  else{
                    
                    matrureamt=cal[0].collection;
                  }
                  waletbal=cal[0].wallet
                  redeemamt=matrureamt+cal[0].wallet;
                  console.log(cal[0].collection);
                }
                })
          }
          var sql="";
          var qt;
          console.log(redeemamt,"AMT");
          if(Status==0){
            sql=`Update schemeregisters set MaturityStatus=:st,MaturityComment=:MaturityComment where ID  in (:SchemeRegId) and MaturityStatus not in (3,2)  `
            qt= {
              replacements: { st: Status,MaturityComment: Comment ,SchemeRegId: SchemeRegId },
              type: QueryTypes.UPDATE,
            }
          }
          else if(Status==2)
          {
          
            sql=`Update schemeregisters set MaturityStatus=:st,RedeemAmt=:redeemamt,MaturityComment=:MaturityComment,Wallet=:waletbal,MatureAmt=:matrureamt where ID  in (:SchemeRegId) and MaturityStatus not in (3,2)  `
            qt= {
              replacements: { st: Status,MaturityComment: Comment ,SchemeRegId: SchemeRegId,redeemamt: redeemamt,waletbal: waletbal,matrureamt:matrureamt },
              type: QueryTypes.UPDATE,
            }
          }
          else if(Status==1)
          {
            sql=`Update schemeregisters set MaturityStatus=:st where ID  in (:SchemeRegId) and MaturityStatus not in (3,2)  `
            qt={
              replacements: { st: Status,SchemeRegId: SchemeRegId,waletbal: waletbal,matrureamt:matrureamt },
              type: QueryTypes.UPDATE,
            }
          }
          else
          {
            sql=`Update schemeregisters set MaturityStatus=:st,RedeemAmt=:redeemamt where ID  in (:SchemeRegId) and MaturityStatus not in (3,2)  `
            qt={
              replacements: { st: Status,redeemamt: redeemamt ,SchemeRegId: SchemeRegId,waletbal: waletbal,matrureamt:matrureamt },
              type: QueryTypes.UPDATE,
            }
          }
          if(flag == 1 && Status !=1)
          {
            console.log("not updated");
            return res
            .status(501)
            .json({  response: "Maturity Status Inactive.You Can Not Mature Or Premature This Acount!!" });
          } 
          else
          {
          Custsw = await sq
            .query(
              sql,qt

            )
            .then(async (res2) => {
                console.log(res2[1],"rst");
                if(res2[1]=== 0)
                {
                  console.log("not updated");
                  return res
                  .status(501)
                  .json({  response: "Alreday Matured .You Can Not Change Maturity Status!!" });
                }
                else
                {
                await schemeregisterhistory.create({
                    SchemeRegId:SchemeRegId,
                    CompanyCode :CompanyCode,
                    Status:Status,
                    Comment:Comment,
                    LoggerId:LoggerID,
                    Type:"Maturity"
                })
                .then(async (rst) => {   
                  console.log(rst,"RESPONSE"); 
                return res
                .status(200)
                .json({ errmsg: false, response: "Maturity Status Updated successfully" });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({ errmsg: true, response: err });
                  });
                } 

            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ errmsg: true, response: err });
            });
          }  
        } 
      return Custsw;
    } 
    catch (error) 
    {
      return res.status(500).json({ status: "FAILED", response: error  });
    }
  }

  async MaturityCertificate(req, res, next) {
    try {
      console.log(req.body,"service");
      var Custsw;
      var val = "";
      var value = [];
      var matrureamt=0;
      var redeemamt=0;
      var withBonus=0;
      var waletbal=0;
      var flag=0;
      var PhoneNumber;
      const { BillNumber, Totalbillamount, Billingdate,Ordernumber,Orderdate,Description,Totalweight,SchemeRegId,CompanyCode  } = req.body;
      // if (CustomerID?.length!=0) {
      //   val = "CustomerID";
      //   value = CustomerID;
      // }
      // else if (UUid?.length != 0) {
      //   val = "UUid";
      //   value = UUid;
      // }

 await sq.query("SELECT sr.CustomerAccNo,sr.MaturityStatus,sr.MaturityComment,sum(et.CollectedAmt) as TotalDepositedAmount,count(CollectionId) as NoOfInstallments,sr.RedeemAmt,sr.EndDate as MaturityDate,sr.UUid FROM `schemeregisters` as sr,emitrans as et WHERE sr.ID = et.SchemeRegId and sr.id=:SchemeRegId  and sr.CompanyCode=:CompanyCode",
          {
            replacements: {SchemeRegId: SchemeRegId ,CompanyCode:CompanyCode},
            type: QueryTypes.SELECT,
          }
 )
 .then(async (Certificate) => {
  console.log(Certificate,"29");
  const check = await MaturityCertificateMaster.findOne({
   
    where: { CustomerAccNo:Certificate[0].CustomerAccNo },
});
if (check) {
  console.error("Customer not found ");
  return res
  .status(400)
  .json({ errmsg: false, response: "Alreday Certificate exists for this account no" });
  // Skip to next iteration if branch not found
}
else
{
  await MaturityCertificateMaster.create({
    CustomerAccNo:Certificate[0].CustomerAccNo,
    CompanyCode:CompanyCode,
    MaturityStatus:Certificate[0].MaturityStatus,
    MaturityComment:Certificate[0].MaturityComment,
    TotalDepositedAmount:Certificate[0].TotalDepositedAmount,
    NoOfInstallments:Certificate[0].NoOfInstallments,
    RedeemAmt:Certificate[0].RedeemAmt,
    MaturityDate:Certificate[0].MaturityDate,
    SchemeRegId:SchemeRegId,
    BillNumber:BillNumber,
    Totalbillamount:Totalbillamount,
    Billingdate:Billingdate,
    Ordernumber:Ordernumber,
    Orderdate:Orderdate,
    Description:Description,
    Totalweight:Totalweight

  })
  .then(async (rst) => {
    const Ph = await CustomerMasters.findOne({
      attributes: ["PhoneNumber"],
      where: { UUid: Certificate[0].UUid },
  });
  
  if (!Ph) {
      console.error("Customer not found ");
      // Skip to next iteration if branch not found
  }
  
  PhoneNumber = Ph.dataValues.PhoneNumber;
            var url = '';
            url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
            url=url+'&mobile=+91'+PhoneNumber+'&message=Thank you for shopping with us!! Your Sonar Kella account is now closed. We hope you enjoyed your association with us. Please keep the invoice safely for future reference. For any query, call us at 8585802375. Regards, Bangasree Jewellers&senderid=BJSKSS&accusage=1&entityid=1201170685649952029&tempid=1207170912997767032'
            console.log(url);
            http.get(url, (response) => {
              let data = '';
            
              // A chunk of data has been received.
              response.on('data', (chunk) => {
                data += chunk;
              });
              response.on('end', () => {
                console.log(data);
              });
            }).on('error', (error) => {
              console.error(`Error: ${error.message}`);
            });
    return res
                .status(200)
                .json({ errmsg: false, response: "Certificate Generated Sucessfully" });
  })
  .catch((err) => {
    console.log(err);
    return res
    .status(400)
    .json({ errmsg: false, response: "Certificare Generation  failed" });
  });
}

 })
      return Custsw;
    } 
    catch (error) 
    {
      return res.status(500).json({ status: "FAILED", response: error  });
    }
  }
  async MaturityCertificateShow(req, res, next) {
    try {
      console.log(req.body,"service");
      var Custsw;
      var val = "";
      var value = [];
      var matrureamt=0;
      var redeemamt=0;
      var withBonus=0;
      var waletbal=0;
      var flag=0;
      const { BillNumber, Totalbillamount, Billingdate,Ordernumber,Orderdate,Description,Totalweight,SchemeRegId,CompanyCode  } = req.body;
      // if (CustomerID?.length!=0) {
      //   val = "CustomerID";
      //   value = CustomerID;
      // }
      // else if (UUid?.length != 0) {
      //   val = "UUid";
      //   value = UUid;
      // }
 await MaturityCertificateMaster.findAll({
  where:{	SchemeRegId:SchemeRegId}
 })
 .then(async (Certificate) => {
  console.log(Certificate);
  res.status(200).json({ errmsg: false, response: Certificate });

 })
      return Custsw;
    } 
    catch (error) 
    {
      return res.status(500).json({ status: "FAILED", response: error  });
    }
  }
}
module.exports = new MaturityStatusService();
