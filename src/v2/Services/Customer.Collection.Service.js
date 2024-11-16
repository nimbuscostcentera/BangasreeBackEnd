const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { MonthlyTrans } = require("../Model/MonthlyTrans.Model");
// const { CustomerPayments } = require("../Model/AgentCollection.Model");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const http = require('http');
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
class CustomerCollectionService {
  async CustomerCollection(req, res, next) {
    // let {email , AgentCode = null} = req.body
    function getLastThreeCharacters(str) {
      return str.slice(-3);
    }
    try {
      var CollDate = new Date();
      var ActualCollection;
      var Walletamt = 0;
      var WalletBalance=0;
      var ExpectedCollection;
      var CollectedAmt1;
      ActualCollection = 0;
      var AcNo
      var CustAC
      var PhoneNumber
      var tot=0
      const { CustUUid, ID, CollectedAmt, PaymentMode, CompanyCode,PaymentType,Utype } =
        req.body;
        var UUid=req.body.UUid;
      console.log(req.body,"ciollection ");
      const Colluuid = uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        // SchemeRegisters.findAll
        const Ph = await CustomerMasters.findOne({
          attributes: ["PhoneNumber"],
          where: { UUid: CustUUid },
      });

      if (!Ph) {
          console.error("Customer not found ");
          // Skip to next iteration if branch not found
      }

      PhoneNumber = Ph.dataValues.PhoneNumber;
        if(Utype==1)
        {
          sq.query(
            "select Am.UUid from agentmasters as Am,customermasters as Cm where Cm.AgentCode=Am.AgentCode and Cm.UUid=:CustUUid",
            {
              replacements: {
                CustUUid: CustUUid,
              },
              type: QueryTypes.SELECT,
            }
          )
          .then(async (Agentuuid) => {
            console.log(Agentuuid,Agentuuid[0].UUid,"check agent");
            UUid=Agentuuid[0].UUid
          })
        }
        SchemeRegisters.findAll({
          where: {
            ID: ID,
            UUid: CustUUid,
          },
        })
          .then(async (Result) => {
            console.log("Ami achi vai",Result[0]);
            AcNo=Result[0].dataValues.CustomerAccNo
            CustAC=getLastThreeCharacters(AcNo);
            console.log(AcNo,CustAC,"check acccount No");
            if (Result.length != 0) {
              console.log("I am in if", CompanyCode,Result[0].dataValues,PaymentType);
              
              if (Result[0].dataValues.MaturityStatus == 2 || Result[0].dataValues.MaturityStatus == 3 )
              {
                return res.status(401).json({
                  status: 500,
                  errmsg: true,
                  response: "Alredy Matured Acount Can Not Take Payment!!",
                });
              }
              else if(Result[0].dataValues.RegfeesTaken==1 && PaymentType==1 )
              {
                return res.status(401).json({
                  status: 500,
                  errmsg: true,
                  response: "Registraion Fees Alreday Taken For This Acount!!",
                });
              }
              else if(Utype==1 ){
                console.log(Utype,PaymentType);
              
                await EmiTrans.create({
                  CollectionUUId: Colluuid,
                  AgentUUid: UUid,
                  CustomerUUid: CustUUid,
                  CollDate: CollDate,
                  CollectedAmt: CollectedAmt,
                  PaymentMode: PaymentMode,
                  SchemeRegId: ID,
                  PaymentType: PaymentType,
                  PaymentStatus: 2,
                  CompanyCode: CompanyCode,
                  NotAgentPayment:1,
                })
                  .then(async (resultCust) => {
                    if(PaymentType==2)
                    {
                    console.log(Result[0].dataValues.EMI, "emi", Result[0]);
                    var emi = Result[0].dataValues.EMI;
                    var frequency = Result[0].dataValues.frequency;
                    var date = new Date();
                    var mnth = date.getMonth() + 1;
                    var yr = date.getFullYear().toString();
                    var month = mnth + "-" + yr;
                    var lstmonth = date.setMonth(date.getMonth() - 1);
                    console.log(frequency, "fqn");
                    if (frequency == "Monthly") {
                      console.log( emi, "Monthly ");
                      ExpectedCollection = emi;
                    } else if (frequency == "Daily") {
                      const numDays = moment(month, "MM-YYYY").daysInMonth();
                      console.log(numDays, "Daily");
                      ExpectedCollection = numDays * emi;
                    } else if (frequency == "Weekly") {
                      const numDays = moment(month, "MM-YYYY").daysInMonth();
                      const noofweek = Math.floor(numDays / 7);
                      ExpectedCollection = noofweek * emi;
                      console.log(noofweek, "no of Weekly");
                    }
                    if (CollectedAmt > ExpectedCollection) {
                      ActualCollection = ExpectedCollection;
                      Walletamt = CollectedAmt - ActualCollection;
                    } else {
                      ActualCollection = CollectedAmt;
                    }
                    WalletBalance = Walletamt;
                    console.log(Walletamt, "wal");
                    sq.query(
                      "SELECT  IFNULL(sum(WalletBalance),0) as WltBlnc,IFNULL(ActualCollection,0) as bcolection FROM `monthlytrans` where SchemeRegId=:SchemeregisterId  ",
                      {
                        replacements: {
                          SchemeregisterId: ID,
                          lstmonth: lstmonth,
                        },
                        type: QueryTypes.SELECT,
                      }
                    ).then(async (WalletBlnc) => {
                      console.log(WalletBlnc[0].WltBlnc, "WltBlnc");
                      if (WalletBlnc.length == 0) {
                        WalletBalance = Number(WalletBalance);
                      } else {
                        WalletBalance =
                          Number(WalletBlnc[0].WltBlnc) + Number(WalletBalance);
                      }
  
                      MonthlyTrans.findAll({
                        where: {
                          SchemeRegId: ID,
                          Month: month,
                        },
                      }).then(async (rstmnth) => {
                        if (rstmnth.length == 0) {
                          CollectedAmt1 =
                            Number(ActualCollection) + Number(WalletBalance);
                          console.log(WalletBalance, CollectedAmt1);
                          if (CollectedAmt1 > ExpectedCollection) {
                            ActualCollection = ExpectedCollection;
                            Walletamt = CollectedAmt1 - ActualCollection;
                          } else {
                            ActualCollection = CollectedAmt1;
                            Walletamt = 0;
                          }
                          WalletBalance = Number(Walletamt);
                          await MonthlyTrans.update(
                            {
                              WalletBalance: 0,
                            },
                            {
                              where: {
                                CompanyCode: CompanyCode,
                                SchemeRegId: ID,
                              },
                            }
                          );
                          await MonthlyTrans.create({
                            CompanyCode: CompanyCode,
                            SchemeRegId: ID,
                            Month: month,
                            ExpectedCollection: ExpectedCollection,
                            ActualCollection: ActualCollection,
                            WalletBalance: WalletBalance,
                          })
                            .then(async (finalrst) => {
                              const TotCol=await sq.query(
                                'SELECT SUM(CollectedAmt) AS totalCollectedAmt FROM emitrans WHERE SchemeRegId = :schemeRegId AND PaymentType = :paymentType and CompanyCode=:CompanyCode',
                                {
                                  replacements: { schemeRegId: ID, paymentType: 2,CompanyCode:CompanyCode },
                                  type: QueryTypes.SELECT
                                }
                              )
                            
                              if (TotCol.length != 0)
                              {
                                tot = TotCol[0].totalCollectedAmt;
                              } 
                              console.log(TotCol,tot,"1");
                              var url = '';
                              url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                              url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +'in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
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
                  

                              return res.status(200).json({
                                errMsg: false,
                                response: "Collection taken Successfully",
                              });
                            })
                            .catch((err) => {
                              console.log(err);
                              return res.status(400).json({
                                errMsg: false,
                                response: "Collection entry  failed ",
                                err,
                              });
                            });
                        } else {
                          console.log(rstmnth);
                          CollectedAmt1 =
                            Number(ActualCollection) +
                            Number(rstmnth[0].dataValues.ActualCollection);
                          WalletBalance = Number(
                            rstmnth[0].dataValues.WalletBalance
                          );
                          console.log(
                            CollectedAmt1,
                            ExpectedCollection,
                            WalletBalance
                          );
                          if (CollectedAmt1 > ExpectedCollection) {
                            ActualCollection = ExpectedCollection;
                            Walletamt =
                              Number(CollectedAmt1) - Number(ActualCollection);
                          } else {
                            ActualCollection = CollectedAmt1;
                          }
                          console.log(Walletamt);
                          WalletBalance =
                            Number(Walletamt) + Number(WalletBalance);
                          await MonthlyTrans.update(
                            {
                              ActualCollection: ActualCollection,
                              WalletBalance: WalletBalance,
                            },
                            {
                              where: {
                                CompanyCode: CompanyCode,
                                SchemeRegId: ID,
                                Month: month,
                              },
                            }
                          )
                            .then(async (finalrst) => {
                              const TotCol=await sq.query(
                                'SELECT SUM(CollectedAmt) AS totalCollectedAmt FROM emitrans WHERE SchemeRegId = :schemeRegId AND PaymentType = :paymentType and CompanyCode=:CompanyCode',
                                {
                                  replacements: { schemeRegId: ID, paymentType: 2,CompanyCode:CompanyCode },
                                  type: QueryTypes.SELECT
                                }
                              )
                              console.log(TotCol,TotCol.length);
                              // tot=0
                              if (TotCol.length != 0)
                              {
                                tot = TotCol[0].totalCollectedAmt;
                              } 
                              console.log(TotCol,tot,"2");
                              var url = '';
                              url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                              url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +'in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
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
                              return res.status(200).json({
                                errMsg: false,
                                response: "Collection taken Successfully",
                              });
                            })
                            .catch((err) => {
                              console.log(err);
                              return res.status(400).json({
                                errMsg: true,
                                response: err,
                                err,
                              });
                            });
                        }
                      });
                    });
                  }
                  else
                  {
                    sq.query(
                      "Update schemeregisters set RegfeesTaken=1 where ID=:SchemeregisterId",
                      {
                        replacements: {
                          SchemeregisterId: ID,
                       
                        },
                        type: QueryTypes.UPDATE,
                      }
                    )
                    .then(async (finalrst) => {
                      return res.status(200).json({
                        errMsg: false,
                        response: "RegistrationFees taken Successfully",
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.status(400).json({
                        errMsg: true,
                        response: err,
                        err,
                      });
                    });
                  }
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.status(500).json({ errmsg: true, response: err });
                  });
              

              }
              else
              {
              await EmiTrans.create({
                CollectionUUId: Colluuid,
                AgentUUid: UUid,
                CustomerUUid: CustUUid,
                CollDate: CollDate,
                CollectedAmt: CollectedAmt,
                PaymentMode: PaymentMode,
                SchemeRegId: ID,
                PaymentType: PaymentType,
                PaymentStatus: 1,
                CompanyCode: CompanyCode,
              })
                .then(async (resultCust) => {
                  if(PaymentType==2)
                  {
                  console.log(Result[0].dataValues.EMI, "emi", Result[0]);
                  var emi = Result[0].dataValues.EMI;
                  var frequency = Result[0].dataValues.frequency;
                  var date = new Date();
                  var mnth = date.getMonth() + 1;
                  var yr = date.getFullYear().toString();
                  var month = mnth + "-" + yr;
                  var lstmonth = date.setMonth(date.getMonth() - 1);
                  console.log(frequency, "fqn");
                  if (frequency == "Monthly") {
                    console.log( emi, "Monthly ");
                    ExpectedCollection = emi;
                  } else if (frequency == "Daily") {
                    const numDays = moment(month, "MM-YYYY").daysInMonth();
                    console.log(numDays, "Daily");
                    ExpectedCollection = numDays * emi;
                  } else if (frequency == "Weekly") {
                    const numDays = moment(month, "MM-YYYY").daysInMonth();
                    const noofweek = Math.floor(numDays / 7);
                    ExpectedCollection = noofweek * emi;
                    console.log(noofweek, "no of Weekly");
                  }
                  if (CollectedAmt > ExpectedCollection) {
                    ActualCollection = ExpectedCollection;
                    Walletamt = CollectedAmt - ActualCollection;
                  } else {
                    ActualCollection = CollectedAmt;
                  }
                  WalletBalance = Walletamt;
                  console.log(Walletamt, "wal");
                  sq.query(
                    "SELECT  IFNULL(sum(WalletBalance),0) as WltBlnc,IFNULL(ActualCollection,0) as bcolection FROM `monthlytrans` where SchemeRegId=:SchemeregisterId  ",
                    {
                      replacements: {
                        SchemeregisterId: ID,
                        lstmonth: lstmonth,
                      },
                      type: QueryTypes.SELECT,
                    }
                  ).then(async (WalletBlnc) => {
                    console.log(WalletBlnc[0].WltBlnc, "WltBlnc");
                    if (WalletBlnc.length == 0) {
                      WalletBalance = Number(WalletBalance);
                    } else {
                      WalletBalance =
                        Number(WalletBlnc[0].WltBlnc) + Number(WalletBalance);
                    }

                    MonthlyTrans.findAll({
                      where: {
                        SchemeRegId: ID,
                        Month: month,
                      },
                    }).then(async (rstmnth) => {
                      if (rstmnth.length == 0) {
                        CollectedAmt1 =
                          Number(ActualCollection) + Number(WalletBalance);
                        console.log(WalletBalance, CollectedAmt1);
                        if (CollectedAmt1 > ExpectedCollection) {
                          ActualCollection = ExpectedCollection;
                          Walletamt = CollectedAmt1 - ActualCollection;
                        } else {
                          ActualCollection = CollectedAmt1;
                          Walletamt = 0;
                        }
                        WalletBalance = Number(Walletamt);
                        await MonthlyTrans.update(
                          {
                            WalletBalance: 0,
                          },
                          {
                            where: {
                              CompanyCode: CompanyCode,
                              SchemeRegId: ID,
                            },
                          }
                        );
                        await MonthlyTrans.create({
                          CompanyCode: CompanyCode,
                          SchemeRegId: ID,
                          Month: month,
                          ExpectedCollection: ExpectedCollection,
                          ActualCollection: ActualCollection,
                          WalletBalance: WalletBalance,
                        })
                          .then(async (finalrst) => {
                            const TotCol=await sq.query(
                              'SELECT SUM(CollectedAmt) AS totalCollectedAmt FROM emitrans WHERE SchemeRegId = :schemeRegId AND PaymentType = :paymentType and CompanyCode=:CompanyCode',
                              {
                                replacements: { schemeRegId: ID, paymentType: 2,CompanyCode:CompanyCode },
                                type: QueryTypes.SELECT
                              }
                            )
                            //  var tot=0
                            console.log(TotCol,TotCol.length,TotCol[0].totalCollectedAmt);
                            if (TotCol.length != 0)
                            {
                              tot = TotCol[0].totalCollectedAmt;
                            } 
                            
                            console.log(TotCol,tot,"3");
                            
                            var url = '';
                            url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                            url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +'in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
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
                            return res.status(200).json({
                              errMsg: false,
                              response: "Collection taken Successfully",
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                            return res.status(400).json({
                              errMsg: false,
                              response: "Collection entry  failed ",
                              err,
                            });
                          });
                      } else {
                        console.log(rstmnth);
                        CollectedAmt1 =
                          Number(ActualCollection) +
                          Number(rstmnth[0].dataValues.ActualCollection);
                        WalletBalance = Number(
                          rstmnth[0].dataValues.WalletBalance
                        );
                        console.log(
                          CollectedAmt1,
                          ExpectedCollection,
                          WalletBalance
                        );
                        if (CollectedAmt1 > ExpectedCollection) {
                          ActualCollection = ExpectedCollection;
                          Walletamt =
                            Number(CollectedAmt1) - Number(ActualCollection);
                        } else {
                          ActualCollection = CollectedAmt1;
                        }
                        console.log(Walletamt);
                        WalletBalance =
                          Number(Walletamt) + Number(WalletBalance);
                        await MonthlyTrans.update(
                          {
                            ActualCollection: ActualCollection,
                            WalletBalance: WalletBalance,
                          },
                          {
                            where: {
                              CompanyCode: CompanyCode,
                              SchemeRegId: ID,
                              Month: month,
                            },
                          }
                        )
                          .then(async (finalrst) => {
                            const TotCol=await sq.query(
                              'SELECT SUM(CollectedAmt) AS totalCollectedAmt FROM emitrans WHERE SchemeRegId = :schemeRegId AND PaymentType = :paymentType and CompanyCode=:CompanyCode',
                              {
                                replacements: { schemeRegId: ID, paymentType: 2,CompanyCode:CompanyCode },
                                type: QueryTypes.SELECT
                              }
                            )
                            console.log(TotCol);
                            // tot=0
                            if (TotCol.length != 0)
                            {
                              tot = TotCol[0].totalCollectedAmt;
                            } 
                            console.log(TotCol,PhoneNumber,CollectedAmt,CustAC,tot,"4");
                            var url = '';
                            url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                            url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +'in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
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
                            return res.status(200).json({
                              errMsg: false,
                              response: "Collection taken Successfully",
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                            return res.status(400).json({
                              errMsg: true,
                              response: err,
                              err,
                            });
                          });
                      }
                    });
                  });
                }
                else
                {
                  sq.query(
                    "Update schemeregisters set RegfeesTaken=1 where ID=:SchemeregisterId",
                    {
                      replacements: {
                        SchemeregisterId: ID,
                     
                      },
                      type: QueryTypes.UPDATE,
                    }
                  )
                  .then(async (finalrst) => {
                    return res.status(200).json({
                      errMsg: false,
                      response: "RegistrationFees taken Successfully",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.status(400).json({
                      errMsg: true,
                      response: err,
                      err,
                    });
                  });
                }
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({ errmsg: true, response: err });
                });
            } 
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: true,
                response: "No Such Schemes For This Customer",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errMsg: true, response: err });
          });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: error });
    }
  }
  async CustomerCollectionEdit(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      var CollDate ;
      var ActualCollection;
      var Walletamt = 0;
      var WalletBalance=0;
      var ExpectedCollection;
      var CollectedAmt1;
      ActualCollection = 0;
      var prevcollection=0;
      var month;
      const { CustUUid, ID, CollectedAmt, PaymentMode, CompanyCode,PaymentType,Utype } =
        req.body;
        var UUid=req.body.UUid;
        CollDate=req.body.CollDate;
        var CollectionId=req.body.CollectionId;
      console.log(req.body,"ciollection ");

      const Colluuid = uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        SchemeRegisters.findAll({
          where: {
            ID: ID,
            UUid: CustUUid,
          },
        })
          .then(async (Result) => {
            console.log("Ami achi vai");
            if (Result.length != 0) {
              console.log("I am in if", CompanyCode);
              if (Result[0].dataValues.MaturityStatus == 2 || Result[0].dataValues.MaturityStatus == 3 )
              {
                return res.status(401).json({
                  status: 500,
                  errmsg: true,
                  response: "Alredy Matured Acount Can Not Take Payment!!",
                });
              }
              else if(Result[0].dataValues.RegfeesTaken==1 && PaymentType==1 )
              {
                return res.status(401).json({
                  status: 500,
                  errmsg: true,
                  response: "Registraion Fees Alreday Taken For This Acount!!",
                });
              }
              else if(Utype==1){
                await EmiTrans.findAll({
                  where:{
                    CollectionId:CollectionId 
                  }
                })
                .then(async (ColectPrev) => {

                  prevcollection=ColectPrev[0].dataValues.CollectedAmt
                  var mnth = CollDate.getMonth() + 1;
                  var yr = CollDate.getFullYear().toString();
                   month = mnth + "-" + yr;
                  await EmiTrans.update({
                    CollectedAmt:CollectedAmt},
                    {where:{
                      CollectionId:CollectionId 
                    }}
                  )
                  .then(async (TransUpdate) => {

                    await MonthlyTrans.findAll({
                      where:{
                        SchemeRegId:ID,
                        Month:month
                      } 
                    })
                    .then(async(MnthTranPrev)=>{
                      ExpectedCollection=MnthTranPrev[0].dataValues.ExpectedCollection;
                      ActualCollection=MnthTranPrev[0].dataValues.ActualCollection;
                      WalletBalance=MnthTranPrev[0].dataValues.WalletBalance;
                      if (Number(prevcollection) <= Number(WalletBalance))
                      {
                        WalletBalance=Number(WalletBalance)-Number(prevcollection)
                      }
                      else{
                        prevcollection=Number(prevcollection)-Number(WalletBalance)
                        WalletBalance=0;
                        ActualCollection=Number(ActualCollection)-Number(prevcollection)
                      }
                      if((Number(ActualCollection)+Number(CollectedAmt)) >  Number(ExpectedCollection))
                      {
                        Number(WalletBalance)=(Number(ActualCollection)+Number(CollectedAmt))- Number(ExpectedCollection)
                        Number(ActualCollection)=Number(ExpectedCollection)
                      }
                      else{
                        ActualCollection=(Number(ActualCollection)+Number(CollectedAmt));
                        WalletBalance=0;
                      }
                      await MonthlyTrans.update({
                        ActualCollection:ActualCollection,
                        WalletBalance:WalletBalance
                      },
                       { where:{
                          SchemeRegId:ID,
                          Month:month
                        } 
                      })
                      .then(async (Finalupdate) => {
                        console.log(Finalupdate);
                        return res.status(200).json({
                          errmsg: false,
                          response: "Collection Updated Successfully",
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        return res.status(400).json({
                          errMsg: false,
                          response: "Collection Edit failed" + err,
                          err,
                        });
                      });

                    })
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.status(400).json({
                      errMsg: false,
                      response: "Collection Edit failed" + err,
                      err,
                    });
                  });
                })  
                .catch((err) => {
                  console.log(err);
                  return res.status(400).json({
                    errMsg: false,
                    response: "Collection Edit failed" + err,
                    err,
                  });
                });
              }
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: true,
                response: "No Such Schemes For This Customer",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errMsg: true, response: err });
          });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: error });
    }
  }
}
module.exports = new CustomerCollectionService();
