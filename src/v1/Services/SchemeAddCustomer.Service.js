const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { BranchMasters } = require("../Model/BranchMaster.Model");
const http = require('http');

const { v4: uuidv4 } = require("uuid");
//  const { Where } = require("sequelize/types/utils");
class SchemeAddCustomerService {
  async SchemeAddCustomer(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      console.log("in scheme add ");
      console.log(req.body, "try start");
      var StartDate;
      var regfees;
      var date = new Date();
      var ac;
      var serial;
      var NomineeIdProofPhoto="";
      var NomineePhoto="";
      var Nomineesignature="";
      var name;
      const {
        CompanyCode,
        LoggerUUid,
        // PageId,
        frequency,
        EMI,
        CustUUid,
        SUUid,
        NomineeName="",
        NomineeDOB="0000-00-00",
        Relation="",
        NomineeIdProofType="",
        NomineeIdProofNumber="",
        NomineePhone=""
        
      } = req.body;
      // var objreq = data;
      if (req.body.NomineeIdProofNumber != '' && req.body.NomineeIdProofNumber != undefined && req.body.NomineeIdProofNumber!= null)
      {
         NomineeIdProofPhoto = req.body.NomineeIdProofNumber + ".jpg";
         NomineePhoto = req.body.NomineeIdProofNumber + ".jpg";
         Nomineesignature = req.body.NomineeIdProofNumber + ".jpg";

      }
      var PhoneNo
      var i = 0;
      var flag = 0;
      const Colluuid = uuidv4();
      //var length1 = objreq.length;
      const DBConnection = await sq.sync().then(async () => {
        if (EMI != 0 && frequency != '') {
          await UserMasters.findAll({
            where: {
              CompanyCode: CompanyCode,
              UUid: LoggerUUid,
            },
          })
            .then(async (result) => {
              name=result[0].UserName
              if (result.length != 0) {
                await UserMasters.findAll({
                  where: {
                    UUid: CustUUid,
                  },
                }).then(async (rst) => {
                  // var newobj = objreq[i];
                console.log(rst[0].dataValues.PhoneNumber, "req list");
                   PhoneNo=rst[0].dataValues.PhoneNumber
                   name=rst[0].dataValues.UserName
                  await SchemeMasters.findAll({
                    where: {
                      SUUid: SUUid,
                      Status: 1,
                    },
                  }).then(async (result1) => {
                    if (result1.length != 0) {
                      sq.query(
                        "SELECT max(AcSerial) as asrl FROM `schemeregisters`",
                        { type: QueryTypes.SELECT }
                      ).then(async (srl) => {
                        if (srl[0].asrl == 0) {
                          serial = "000001";
                        } else {
                          serial = Number(srl[0].asrl) + 1;
                          serial = serial.toString();
                          while (serial.length < 6) {
                            serial = "0" + serial;
                          }

                          //  var formattedNumber = ("0" + serial).slice(-6);
                          //   console.log(formattedNumber);
                        }
                        regfees = result1[0].Regfees;
                        StartDate = date;
                       var mnth = StartDate.getMonth() + 1;
                       mnth = mnth < 10 ? "0" + mnth : mnth.toString();
                       console.log(mnth, "Month Logs");
                        console.log(StartDate.getMonth(), "Month logs here");
                        
                        var yr = StartDate.getFullYear().toString();
                        yr = yr.substring(2);
                        // console.log(yr);
                        BranchMasters.findAll({
                          where: {
                            BranchId: rst[0].BranchId,
                          },
                        }).then(
                          async (BranchCode) => {
                            console.log(BranchCode[0].dataValues.BranchCode, "branchcode");
                            ac =BranchCode[0].dataValues.BranchCode +"/" + mnth + yr +"/" + serial;
                        var EndDate = new Date(StartDate);
                        console.log(EndDate, "months");
                        var newMonth = EndDate.getMonth() + result1[0].Duration;
                        var yearsToAdd = Math.floor(newMonth / 12);
                        var remainingMonths = newMonth % 12;
                        console.log(yearsToAdd);
                        // Adjust the date

                        EndDate.setMonth(remainingMonths);
                        EndDate.setFullYear(EndDate.getFullYear() + yearsToAdd);
                        // EndDate= addMonths(StartDate, result1.Duration);
                        //   console.log(EndDate);
                        // }
                        // if (result1[0].DurationType == "Years") {
                        //   var EndDate = new Date(StartDate);
                        //   EndDate.setFullYear(EndDate.getFullYear() + years);
                        // }

                        await sq
                          .query(
                            "INSERT INTO `schemeregisters`(`SUUid`, `CompanyCode`, `UUid`, `StartDate`, `EndDate`, `BonusStatus`,`MaturityStatus`,`AcSerial`,`CustomerAccNo`,`EMI`,`frequency`,`Nomineename`,`NomineeDOB`,`Relation`,`NomineeIdProofType`,`NomineeIdProofNumber`,`NomineeIdProofPhoto`,`NomineePhoto`,`Nomineesignature`,`NomineePhone`,`regfees`) VALUES (:SUUid,:CompanyCode,:uuid,:StartDate,:EndDate,1,1,:serial,:ac,:EMI,:frequency,:Nomineename,:NomineeDOB,:Relation,:NomineeIdProofType,:NomineeIdProofNumber,:NomineeIdProofPhoto,:NomineePhoto,:Nomineesignature,:NomineePhone,:regfees)",
                            {
                              replacements: {
                                SUUid: SUUid,
                                CompanyCode: CompanyCode,
                                uuid: CustUUid,
                                StartDate: StartDate,
                                EndDate: EndDate,
                                serial: serial,
                                ac: ac,
                                EMI: EMI,
                                frequency: frequency,
                                Nomineename:NomineeName,
                                NomineeDOB:NomineeDOB,
                                Relation:Relation,
                                NomineeIdProofType:NomineeIdProofType,
                                NomineeIdProofNumber:NomineeIdProofNumber,
                                NomineeIdProofPhoto:NomineeIdProofPhoto,
                                NomineePhoto:NomineePhoto,
                                Nomineesignature:Nomineesignature,
                                NomineePhone:NomineePhone,
                                regfees:regfees
                              },
                              type: QueryTypes.INSERT,
                            }
                          )
                          .then(async (schemreg) => {
                            var url="";
                ////___________________________________SMS Integration__________________________________________________________________________________________________________________________________
                              console.log(PhoneNo);
                              url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                              url=url+'&mobile=+91'+ PhoneNo+'&message=Hello '+name+' , You have successfully subscribed to a Sonar Kella scheme. Your account number is '+ac+' . Login to www.bangasreejewellers.com to check your account details and balance. For any query, please call 8585023758 or visit your nearest branch/office. Regards, Bangasree Jewellers&senderid=BJSWRN&accusage=1&entityid=1201170685649952029&tempid=1207171266199833661'
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
                  //_____________________________________________________________________________________________________
                              return res.status(200).json({
                                errMsg: false,
                                response:
                                  "Scheme Added to This Customer Succssfully.",
                              });
                          })
                          .catch((err) => {
                            console.log(err);
                            return res.status(400).json({
                              errMsg: false,
                              response: "Scheme Added to This Custometr  failed",
                              err,
                            });
                          });
                      });
                    });
                    } else {
                      return res.status(400).json({
                        errMsg: true,
                        message: "No Such Active Scheme Avilable",
                      });
                    }
                  });
                });
              } else {
                return res.status(400).json({
                  errMsg: true,
                  message: "You atre Not Authorized To Access This Page",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).json({ errMsg: true, response: err });
            });
        }
        else {
           return res.status(400).json({ errMsg: true, response: "Emi Can Not Be Zero or You have to select a Frequency" });
        }
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
  async SchemeEditCustomer(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      console.log("in scheme add ");
      console.log(req.body, "try start");
      var StartDate;
      var regfees;
      var date = new Date();
      var ac;
      var serial;
      const {
        CompanyCode,
        UUid,
        // PageId,
        frequency,
        EMI,
        CustUUid,
        SUUid,
        Nomineename,
        NomineeDOB,
        Relation,
        NomineeIdProofType,
        NomineeIdProofNumber,
        SchemeRegId
      } = req.body;
      // var objreq = data;
      var  NomineeIdProofPhoto = req.body.NomineeIdProofNumber + ".jpg";
      var  NomineePhoto = req.body.NomineeIdProofNumber + ".jpg";
      var Nomineesignature = req.body.NomineeIdProofNumber + ".jpg";
      var i = 0;
      var flag = 0;
      const Colluuid = uuidv4();
      //var length1 = objreq.length;
      const DBConnection = await sq.sync().then(async () => {
                        await EmiTrans.findAll({
                          where:{
                            SchemeRegId:SchemeRegId
                          }
                        })
                        .then(async (TranCheck) => {
                          console.log(TranCheck);
                            if(TranCheck.length==0){
                              console.log("in s edit");
                                await SchemeRegisters.update({
                                  SUUid:SUUid,
                                  EMI:EMI,
                                  frequency:frequency,
                                  Nomineename:Nomineename,
                                  NomineeDOB:NomineeDOB,
                                  Relation:Relation,
                                  NomineeIdProofType:NomineeIdProofType,
                                  NomineeIdProofNumber:NomineeIdProofNumber,
                                  NomineeIdProofPhoto:NomineeIdProofPhoto,
                                  NomineePhoto:NomineePhoto,
                                  Nomineesignature:	Nomineesignature,
                                },{
                                  where:{
                                    ID:SchemeRegId
                                  }
                                } 
                                )
                                .then((RegRes) => {
                                  console.log(RegRes,"update");
                                  return res.status(200).json({
                                    errMsg: false,
                                    response: "Scheme Updated Succssfully",
                                  });
                                })
                                .catch((err) => {
                                  console.log(err,"in error");
                                  return res.status(500).json({
                                    errMsg: false,
                                    Response: "Scheme Updation failed." + err,
                                  });
                                });
                            }
                            else{
                              return res.status(400).json({
                                errMsg: true,
                                response:
                                  "Alreday Have Transcation For This Scheme You Can Not Edit Any More!!!",
                              });
                            }

                        })
                        .catch((err) => {
                          console.log(err);
                          return res.status(500).json({
                            errMsg: false,
                            Response: "Scheme Updation failed." + err,
                          });
                        });
 
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
  async SchemeDeleteCustomer(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      console.log("in scheme add ");
      console.log(req.body, "try start");
      var StartDate;
      var regfees;
      var date = new Date();
      var ac;
      var serial;
      const {
        CompanyCode,
        UUid,
        // PageId,
        frequency,
        EMI,
        CustUUid,
        SUUid,
        Nomineename,
        NomineeDOB,
        Relation,
        NomineeIdProofType,
        NomineeIdProofNumber,
        SchemeRegId
      } = req.body;
      // var objreq = data;
      var  NomineeIdProofPhoto = req.body.NomineeIdProofNumber + ".jpg";
      var  NomineePhoto = req.body.NomineeIdProofNumber + ".jpg";
      var Nomineesignature = req.body.NomineeIdProofNumber + ".jpg";
      var i = 0;
      var flag = 0;
      const Colluuid = uuidv4();
      //var length1 = objreq.length;
      const DBConnection = await sq.sync().then(async () => {
                        await EmiTrans.findAll({
                          where:{
                            SchemeRegId:SchemeRegId
                          }
                        })
                        .then(async (TranCheck) => {
                            if(TranCheck.length==0){
                                await SchemeRegisters.destroy({
                                  where:{
                                    ID:SchemeRegId
                                  }
                                } 
                                )
                                .then((RegRes) => {
                                  return res.status(200).json({
                                    errMsg: false,
                                    response: "Scheme Deleted Succssfully",
                                  });
                                })
                                .catch((err) => {
                                  console.log(err);
                                  return res.status(500).json({
                                    errMsg: false,
                                    Response: "Scheme Deletion failed." + err,
                                  });
                                });
                            }
                            else{
                              return res.status(400).json({
                                errMsg: true,
                                response:
                                  "Alreday Have Transcation For This Scheme You Can Not Delete!!!",
                              });
                            }

                        })
                        .catch((err) => {
                          console.log(err);
                          return res.status(500).json({
                            errMsg: false,
                            Response: "Scheme Deletion failed." + err,
                          });
                        });
 
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new SchemeAddCustomerService();
