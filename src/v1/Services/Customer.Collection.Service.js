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
      console.log("hello sayed")
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
      var areaid;
      var tot=0
      const { CustUUid, ID, CollectedAmt, PaymentMode, CompanyCode,PaymentType,Utype,gold_rate } =
        req.body;
        var UUid=req.body.LoggerUUid;        
        if (req.body.CollectionDate != '' && req.body.CollectionDate != null && req.body.CollectionDate != "undefined"  )
        {
          CollDate=req.body.CollectionDate
        }
      const Colluuid = uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        // SchemeRegisters.findAll
        const Ph = await CustomerMasters.findOne({
          attributes: ["PhoneNumber","AreaID"],
          where: { UUid: CustUUid },
      });

      if (!Ph) {
          console.error("Customer not found ");
          // Skip to next iteration if branch not found
      }

      PhoneNumber = Ph.dataValues.PhoneNumber;
      areaid=Ph.dataValues.AreaID;
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
            AcNo=Result[0].dataValues.CustomerAccNo
            CustAC=getLastThreeCharacters(AcNo);
            if (Result.length != 0) {  
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
                  response: "Registraion Fees Already Taken For This Acount!!",
                });
              }
              else if(Utype==1 ){ 
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
                  AreaID:areaid,
                  gold_rate: gold_rate
                })
                  .then(async (resultCust) => {
                    console.log(resultCust,"resultCust");
                    if(PaymentType==2)
                    {
                    var emi = Result[0].dataValues.EMI;
                    var frequency = Result[0].dataValues.frequency;
                    var date = new Date(CollDate);
                    var mnth = date.getMonth() + 1;
                    var yr = date.getFullYear().toString();
                    var month = mnth + "-" + yr;
                    var lstmonth = date.setMonth(date.getMonth() - 1);
                    console.log(frequency,"check frequency");
                     
                    if (frequency.trim() == "Monthly") {
                      ExpectedCollection = emi;
                    } else if (frequency.trim() == "Daily") {
                      const numDays = moment(month, "MM-YYYY").daysInMonth();
                      ExpectedCollection = numDays * emi;
                    } else if (frequency.trim() == "Weekly") {
                      console.log("in Weekly");
                      
                      const numDays = moment(month, "MM-YYYY").daysInMonth();
                      const noofweek = Math.floor(numDays / 7);
                      ExpectedCollection = noofweek * emi;
                      console.log(noofweek,numDays, "no of Weekly tridib");
                    }
                    if (CollectedAmt > ExpectedCollection) {
                      ActualCollection = ExpectedCollection;
                      Walletamt = CollectedAmt - ActualCollection;
                    } else {
                      ActualCollection = CollectedAmt;
                    }
                    WalletBalance = Walletamt;
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
                              var url = '';
                              url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                              url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +' in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
                                
                              http.get(url, (response) => {
                                let data = '';
                              
                                // A chunk of data has been received.
                                response.on('data', (chunk) => {
                                  data += chunk;
                                });
                                response.on('end', () => {
                               
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
                             
                              return res.status(400).json({
                                errMsg: false,
                                response: "Collection entry  failed ",
                                err,
                              });
                            });
                        } else {
                         
                          ActualCollection=CollectedAmt
                          CollectedAmt1 =
                            Number(ActualCollection) +
                            Number(rstmnth[0].dataValues.ActualCollection);
                          WalletBalance = Number(
                            rstmnth[0].dataValues.WalletBalance
                          );
                          if (CollectedAmt1 > ExpectedCollection) {
                            ActualCollection = ExpectedCollection;
                            Walletamt =
                              Number(CollectedAmt1) - Number(ActualCollection);
                          } else {
                            ActualCollection = CollectedAmt1;
                          }
                          
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
                             
                              if (TotCol.length != 0)
                              {
                                tot = TotCol[0].totalCollectedAmt;
                              } 
                              var url = '';
                              url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                              url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +' in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
                              
                              http.get(url, (response) => {
                                let data = '';
                              
                                // A chunk of data has been received.
                                response.on('data', (chunk) => {
                                  data += chunk;
                                });
                                response.on('end', () => {
                                  //console.log(data);
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
                      return res.status(400).json({
                        errMsg: true,
                        response: err,
                        err,
                      });
                    });
                  }
                  })
                  .catch((err) => {
                    return res.status(400).json({ errmsg: true, response: err.message });
                  });
              }
              else
              {
                console.log("Agent Collecting data Sayed")
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
                AreaID:areaid,
                gold_rate: gold_rate
              })
                .then(async (resultCust) => {
                  console.log(PaymentType,"tara paynet type");
                  
                  if(PaymentType==2)
                  {
                  console.log(Result[0].dataValues.EMI, "emi", Result[0]);
                  var emi = Result[0].dataValues.EMI;
                  var frequency = Result[0].dataValues.frequency;
                  var date = new Date(CollDate);
                  var mnth = date.getMonth() + 1;
                  var yr = date.getFullYear().toString();
                  var month = mnth + "-" + yr;
                  var lstmonth = date.setMonth(date.getMonth() - 1);
               // console.log(frequency, "fqn");
                  if (frequency.trim() == "Monthly") {
                    //console.log( emi, "Monthly ");
                    ExpectedCollection = emi;
                  } else if (frequency.trim() == "Daily") {
                    const numDays = moment(month, "MM-YYYY").daysInMonth();
                    console.log(numDays, "Daily");
                    ExpectedCollection = numDays * emi;
                  } else if (frequency.trim() == "Weekly") {
                    const numDays = moment(month, "MM-YYYY").daysInMonth();
                    const noofweek = Math.floor(numDays / 7);
                    ExpectedCollection = noofweek * emi;
                    }
                    
                    
                  if (CollectedAmt > ExpectedCollection) {
                    ActualCollection = ExpectedCollection;
                    Walletamt = CollectedAmt - ActualCollection;
                  }
                  else {
                   
                    ActualCollection = CollectedAmt;
                    }
                          
                    WalletBalance = Walletamt;
               console.log(ExpectedCollection,CollectedAmt,Walletamt,lstmonth,"rupsha collection");
                  
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
                  console.log(WalletBlnc[0].WltBlnc, "WltBlnc rup");
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
                        // //console.log(WalletBalance, CollectedAmt1);
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
                            console.log(finalrst, "trasha");
                            
                            const TotCol=await sq.query(
                              'SELECT SUM(CollectedAmt) AS totalCollectedAmt FROM emitrans WHERE SchemeRegId = :schemeRegId AND PaymentType = :paymentType and CompanyCode=:CompanyCode',
                              {
                                replacements: { schemeRegId: ID, paymentType: 2,CompanyCode:CompanyCode },
                                type: QueryTypes.SELECT
                              }
                            )
                            //  var tot=0
                           // //console.log(TotCol,TotCol.length,TotCol[0].totalCollectedAmt);
                            if (TotCol.length != 0)
                            {
                              tot = TotCol[0].totalCollectedAmt;
                            } 
                            
                            ////console.log(TotCol,tot,"3");
                            
                            var url = '';
                            url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                            url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +' in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
                           // //console.log(url);
                            http.get(url, (response) => {
                              let data = '';
                            
                              // A chunk of data has been received.
                              response.on('data', (chunk) => {
                                data += chunk;
                              });
                              response.on('end', () => {
                            //    //console.log(data);
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
                       // ////console.log(rstmnth,ActualCollection,"08.05 actual");
                        ActualCollection=CollectedAmt
                        CollectedAmt1 =
                          Number(ActualCollection) +
                          Number(rstmnth[0].dataValues.ActualCollection);
                        WalletBalance = Number(
                          rstmnth[0].dataValues.WalletBalance
                        );
                        // console.log(
                        //   CollectedAmt1,
                        //   ExpectedCollection,
                        //   WalletBalance,"check 08.05"
                        // );
                        if (CollectedAmt1 > ExpectedCollection) {
                          ActualCollection = ExpectedCollection;
                          Walletamt =
                            Number(CollectedAmt1) - Number(ActualCollection);
                        } else {
                          ActualCollection = CollectedAmt1;
                        }
                        //console.log(Walletamt);
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
                            //console.log(TotCol);
                            // tot=0
                            if (TotCol.length != 0)
                            {
                              tot = TotCol[0].totalCollectedAmt;
                            } 
                            //console.log(TotCol,PhoneNumber,CollectedAmt,CustAC,tot,"4");
                            var url = '';
                            url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                            url=url+'&mobile=+91'+PhoneNumber+'&message=Hello, you have deposited Rs.'+ CollectedAmt +' in your BJPL account ending with'+ CustAC+'. Your total account balance is Rs.'+ tot+'. Thank you. Regards, Bangasree Jewellers&senderid=BJPLSB&accusage=1&entityid=1201170685649952029&tempid=1207171023092273541'
                           //console.log(url);
                            http.get(url, (response) => {
                              let data = '';
                            
                              // A chunk of data has been received.
                              response.on('data', (chunk) => {
                                data += chunk;
                              });
                              response.on('end', () => {
                                //console.log(data);
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
                            //console.log(err);
                            return res.status(400).json({
                              errMsg: true,
                              response: err,
                              err,
                            });
                          });
                      }
                    });
                  })
                  .catch((err) => {
                     console.log(err);
                            return res.status(400).json({
                              errMsg: false,
                              // response: "Collection entry  failed ",
                              err,
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
                    //console.log(err);
                    return res.status(400).json({
                      errMsg: true,
                      response: err,
                      err,
                    });
                  });
                }
                })
                .catch((err) => {
                  //console.log(err);
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
            //console.log(err);
            return res.status(500).json({ errMsg: true, response: err });
          });
      });
      return DBConnection;
    } catch (error) {
      //console.log(error);
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
        CollDate=new Date(req.body.CollDate);
        var CollectionId=req.body.CollectionId;
      //console.log(req.body,"ciollection ");

      const Colluuid = uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        SchemeRegisters.findAll({
          where: {
            ID: ID,
            UUid: CustUUid,
          },
        })
          .then(async (Result) => {
            //console.log("Ami achi vai");
            if (Result.length != 0) {
              //console.log("I am in if", CompanyCode);
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
                        //console.log(Finalupdate);
                        return res.status(200).json({
                          errmsg: false,
                          response: "Collection Updated Successfully",
                        });
                      })
                      .catch((err) => {
                        //console.log(err);
                        return res.status(400).json({
                          errMsg: false,
                          response: "Collection Edit failed" + err,
                          err,
                        });
                      });

                    })
                  })
                  .catch((err) => {
                    //console.log(err);
                    return res.status(400).json({
                      errMsg: false,
                      response: "Collection Edit failed" + err,
                      err,
                    });
                  });
                })  
                .catch((err) => {
                  //console.log(err);
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
            //console.log(err);
            return res.status(500).json({ errMsg: true, response: err });
          });
      });
      return DBConnection;
    } catch (error) {
      //console.log(error);
      return res.status(500).json({ errMsg: true, response: error });
    }
  }
 async Deletecollection(req, res, next) {
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
      const { CustUUid, ID,  CompanyCode,PaymentType,Utype } =
        req.body;
        var UUid=req.body.UUid;
        CollDate=new Date(req.body.CollDate);
        var CollectionId=req.body.CollectionId;
      console.log(CollDate,"ciollection ");

      const Colluuid = uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        SchemeRegisters.findAll({
          where: {
            ID: ID,
            UUid: CustUUid,
          },
        })
          .then(async (Result) => {
            //console.log("Ami achi vai");
            if (Result.length != 0) {
              //console.log("I am in if", CompanyCode);
              if (Result[0].dataValues.MaturityStatus == 2 || Result[0].dataValues.MaturityStatus == 3 )
              {
                return res.status(400).json({
                  status: 500,
                  errmsg: true,
                  response: "Alredy Matured Acount Can Not delete!!",
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
console.log(ColectPrev,"test");

                  prevcollection = ColectPrev[0].dataValues.CollectedAmt;

                  var mnth = CollDate.getMonth() + 1;
                  var yr = CollDate.getFullYear().toString();
                  console.log(mnth,yr);
                  
                   month = mnth + "-" + yr;
                  await EmiTrans.destroy(
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
                      console.log(WalletBalance,prevcollection,"check01");
                      if (Number(prevcollection) <= Number(WalletBalance))
                      {
                        WalletBalance=Number(WalletBalance)-Number(prevcollection)
                        
                      }
                      else{
                        prevcollection=Number(prevcollection)-Number(WalletBalance)
                        WalletBalance=0;
                        ActualCollection=Number(ActualCollection)-Number(prevcollection)
                      }
                      if((Number(ActualCollection)) >  Number(ExpectedCollection))
                      {
                        console.log("here i am 1");
                        Number(WalletBalance)=(Number(ActualCollection))- Number(ExpectedCollection)
                        Number(ActualCollection)=Number(ExpectedCollection)
                      }
                      else{
                        console.log("here i am");
                        ActualCollection=(Number(ActualCollection));
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
                        //console.log(Finalupdate);
                        return res.status(200).json({
                          errmsg: false,
                          response: "Collection Deleted Successfully",
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        return res.status(400).json({
                          errMsg: false,
                          response: "Collection Delete failed" + err,
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
            }
            else
            {
               console.log("No Such Schemes For This Customer");
              return res.status(200).json({
                status: 400,
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
