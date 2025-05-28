const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { BranchMasters } = require("../Model/BranchMaster.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { AreaMasters } = require("../Model/AreaMaster.Model");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { designations } = require("../Model/Designation.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { MonthlyTrans } = require("../Model/MonthlyTrans.Model");
// const { CustomerPayments } = require("../Model/AgentCollection.Model");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { PassBookMaster } = require("../Model/PassBookMaster.Model");
const moment = require('moment');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const path =require("path");

const xlsx = require('xlsx');
const fs = require('fs');
const { Console } = require("console");

// Load Excel file  
try{
    console.log("1");
   

    //  __filename='MasterTemplateFINAL.xlsx'
     
        // var workbook = xlsx.readFile(path.resolve(__dirname,'NewEntries-MasterTemplate-v3.0.xlsx')); 
     var workbook = xlsx.readFile(path.resolve(__dirname,'Nimbus-Checking-12Feb-Final.xlsx')); 
   

    // Select the first sheet
    var sheetName = workbook.SheetNames[2];
    var sheet = workbook.Sheets[sheetName]; 

    // Convert the sheet to JSON object
    // var data = xlsx.utils.sheet_to_json(sheet);
    var length
    // 
    var i;

    var data = xlsx.utils.sheet_to_json(sheet, { raw: false }); // Parse dates instead of leaving them as serial numbers

// Convert Excel serial date numbers to JavaScript Date objects
data.forEach(function(row) {
    for (var key in row) {
        if (row.hasOwnProperty(key) && typeof row[key] === 'number' && xlsx.SSF.is_date(key)) {
            row[key] = xlsx.SSF.format('yyyy-mm-dd', row[key]); // Adjust the format as needed
        }
    }
});
length=data.length;
    // Display the JSON object
    function convertDate(inputDate) {
      // Split the input date into month abbreviation and year
      var parts = inputDate.split('-');
      var monthAbbreviation = parts[0];
      var year = parts[1];
  
      // Create a Date object with the month abbreviation and year
      var date = new Date(Date.parse(monthAbbreviation + " 1, 20" + year));
  
      // Format the date as "MM-YYYY"
      var month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
      var formattedDate = month + '-' + date.getFullYear();
  
      return formattedDate;
  }
  

    console.log(data,length,sheetName,"check");
    if(sheetName=='Agent')
    {
        (async () => {
        for(i=0;i<length;i++)
        {

            
            console.log("in agent",i);
            var Pwd = bcrypt.genSaltSync(10);
                var date = new Date();
                var AgentCode;
                var serial;
                // console.log(date);
                var EmailId = data[i].EmailId || null;
                var BranchCode =  data[i].BranchCode;
                var SuperUserID =  data[i].SuperUserID;
                var Name =  data[i].Name;
                var Address =  data[i].Address;
                var Geolocation =  data[i].Geolocation || null;
                var Phonenumber =  data[i].Phonenumber;
                // const password = req.body.password;
                var BankName =  data[i].BankName; 
                var AccountNumber =  data[i].AccountNumber;
                var IFSCCode =  data[i].IFSCCode;
                var MICR =  data[i].MICR || null;
                var NomineeName =  data[i].NomineeName || null;
                var Relation =  data[i].Relation || null;
                var DOB =  data[i].DOB;
                var Sex =  data[i].Sex;
                var Photo =  data[i].Phonenumber+".jpg";
                var AccountType =  data[i].AccountType;
                var CompanyCode =  data[i].CompanyCode;
                var IDProofPhoto =  data[i].Phonenumber+".jpg";
                var Signature =  data[i].Phonenumber+".jpg";
                // console.log(req.body.IdProofType,req.body,"type req");
                var IDProofType =  data[i].IDProofType;
                var IDProofNumber =  data[i].IDProofNumber;
                AgentCode= data[i].AgentCode;
              
                //  var UserID= data[i].UserID;
                var BranchId;
                var Commision= data[i].Commision;
                var Area=data[i].AreaName
                var Utype = 2;
                var uuid = uuidv4();
                var password="Abc@123"
                var hashPassword = bcrypt.hashSync(password, Pwd);
                console.log(hashPassword,CompanyCode,Phonenumber,"check import");
                // const { DIRProfilePhoto  } = require("../Images/Agent/ProfilePhoto");
                // const { DIRIdProof  } = require("../Images/Agent/IdProof");
                // const { DIRSignature  } = require("../Images/Agent/Signature");

                // BranchMasters.findAll({
                //     attributes: ["BranchId"],
                //     where: { 
                //         BranchCode : BranchCode,
                //      } ,
                // })
                // .then(async (BRANCH) => {
                //     console.log(BRANCH[0].dataValues.BranchId);
                //     BranchId=BRANCH[0].dataValues.BranchId;
                // })
                const AreaID = await AreaMasters.findOne({
                  attributes: ["AreaID"],
                  where: { AreaName: Area },
              });

              if (!AreaID) {
                  console.error("AreaID not found of this  name:", Area);
                  continue; // Skip to next iteration if branch not found
              }
  console.log(AreaID,"check area");
  var AreaI
  AreaI = AreaID.dataValues.AreaID;
                          console.log(SuperUserID,IDProofType,"check super",Phonenumber);
                          const agent =    await AgentMasters.create({
                              UUid: uuid,
                              EmailId: EmailId,
                              AgentCode: AgentCode,
                              CompanyCode: CompanyCode,
                              SuperUserID: SuperUserID,
                              Name: Name,
                              Address: Address,
                              Geolocation: Geolocation,
                              Phonenumber: Phonenumber,
                              password: hashPassword,
                              BankName: BankName,
                              AccountType: AccountType,
                              AccountNumber: AccountNumber,
                              IFSCCode: IFSCCode,
                              MICR: MICR,
                              NomineeName: NomineeName,
                              Relation: Relation,
                              DOB: DOB,
                              Sex: Sex,
                              IDProofType: IDProofType,
                              IDProofNumber: IDProofNumber,
                              IDProofPhoto: IDProofPhoto,
                              Signature: Signature,
                              Photo: Photo,
                              AcSerial:1,
                              Commision:Commision,
                              Status: 1,
                              AreaID:AreaI,
                            })
                            const branch = await BranchMasters.findOne({
                                attributes: ["BranchId"],
                                where: { BranchCode: BranchCode },
                            });
                            
                            if (!branch) {
                                console.error("Branch not found for BranchCode:", BranchCode);
                                continue; // Skip to next iteration if branch not found
                            }
                
                            BranchId = branch.dataValues.BranchId;
                            //   .then(RegRes => {
                                // console.log(RegRes,i,"after agent create");
                                // console.log("I am in then of usermaster create",BranchId,Phonenumber);
                                await  UserMasters.create({
                                  UUid: uuid,
                                  Eamil: EmailId,
                                  PhoneNumber: Phonenumber,
                                  Password: hashPassword,
                                  UserName: Name,
                                  CompanyCode: CompanyCode,
                                  Utype: Utype,
                                  BranchId:BranchId,
                                })
                                //   .then(RegRes1 => {
                                  
                                await sq
                                      .query(
                                        "INSERT INTO `userpermissions`(`CompanyCode`, `Utype`, `UUid`, `PageId`, `View`, `Add`, `Edit`, `Del`,`createdAt`,`updatedAt`) SELECT ud.CompanyCode,ud.Utype, um.UUid,ud.PageId, `View`, `Add`, `Edit`, `Del`,:date,:date from usermasters as um inner join userdefaults as ud on ud.Utype=um.Utype where um.UUid=:uuid;",
                                        {
                                          replacements: { 
                                            uuid: uuid,
                                            date: date,
                                          },
                                          type: QueryTypes.INSERT,
                                        }
                                      )
                                      .then((RegRes2) => {
          
                                        // return res.status(200).json({
                                        //   errMsg: false,
                                        //   response: "Registration successful",
                                        // });
                                      });
                            //       })
                            //       .catch((err) => {
                            //         console.log(err);
                            //         // return res.status(400).json({
                            //         //   errMsg: false,
                            //         //   response: "Registration failed." + err,
                            //         // });
                            //       });
                            // //   })
                            //   .catch((err) => {
                            //     console.log(err);
                            //     // return res.status(400).json({
                            //     //   errMsg: false,
                            //     //   response: "Registration failed.",
                            //     //   msg: err,
                            //     // });
                            //   });
        }
    })();
    }
    else if(sheetName=='Branch')
    {
      (async () => {
        for(i=0;i<length;i++)
        {
            var BranchCode=data[i].BranchCode;
            var BranchName=data[i].BranchCode;
            var CompanyCode=data[i].CompanyCode;
            var AreaID
            var Area =data[i].AreaId;
            const AreaI = await AreaMasters.findOne({
              attributes: ["AreaID"],
              where: { AreaName: Area },
          });
        
              
              AreaID = AreaI.dataValues.AreaID;
              console.log("i am in branch",AreaID);
              await  BranchMasters.create({
                BranchCode: BranchCode,
                CompanyCode: CompanyCode,
                BranchName: BranchName,
                AreaId: AreaID,
                Status: 3,
              })
                .then((RegRes) => {
                  console.log(RegRes);
                //   return res.status(200).json({
                //     errMsg: false,
                //     response: "Branch Created Succssfully",
                //   });
                })
                .catch((err) => {
                  console.log(err);
                //   return res.status(500).json({
                //     errMsg: false,
                //     Response: "Branch Creation failed." + err,
                //   });
                });
          
        }
      })();
    }
    else if(sheetName=='Customer')
    {
        (async () => {
            for(i=0;i<length;i++)
            {
                
                var Pwd = bcrypt.genSaltSync(10);
                    var ac;
                    var serial;
                    var date = new Date();
                    var StartDate;
                    var Utype = 3;
                    var EndDate;
                    var LeadId = "";
                    var regfees;
                    var SuperUserID=data[i].SuperUserID ;
                    var AgentCode=data[i].AgentCode;
                    var CustomerName=data[i].CustomerName;
                    var Guardian=data[i].Guardian ;
                    var Address=data[i].Address;
                    var LocalBody=data[i].LocalBody ;
                    var LandMark=data[i].LandMark || null;
                    var GeoLocation=data[i].GeoLocation || null;
                    var PhoneNumber=data[i].PhoneNumber;
                    var AlternateNo=data[i].AlternateNo || null;
                    var EmailId=data[i].EmailId || null;
                    var DOB=data[i].DOB;
                    var Occupation=data[i].Occupation;
                    var Sex=data[i].Sex;
                    var IdProofType=data[i].IdProofType;
                    var IdProofNumber=data[i].IdProofNumber;
                    var CompanyCode=data[i].CompanyCode;
                    var AgentUUid=data[i].AgentUUid;
                    var BranchCode=data[i].BranchCode;
                    var IdProofPhoto = data[i].PhoneNumber+ ".jpg";
                    var AplicantPhoto = data[i].PhoneNumber + ".jpg";
                    var Customersignature = data[i].PhoneNumber + ".jpg";
                    var  NomineeIdProofPhoto = data[i].PhoneNumber + ".jpg";
                    var  NomineePhoto = data[i].PhoneNumber + ".jpg";
                    var Nomineesignature = data[i].PhoneNumber + ".jpg";
                    var BranchId                      
                    const uuid = uuidv4();
                    var password = "Abc@123";
                    const CustCreationPromises = [];
                    const hashPassword = bcrypt.hashSync(password, Pwd);
                    var Area=data[i].AreaName
                    // const Colluuid = uuidv4();
                    // console.log(req.body, hashPassword);
                    // sq.sync().then(() =>
      
                        console.log(hashPassword,SuperUserID,PhoneNumber,"Check customer ");
        
                          
                              console.log("before create", serial);
                              const AreaID = await AreaMasters.findOne({
                                attributes: ["AreaID"],
                                where: { AreaName: Area },
                            });
              
                            if (!AreaID) {
                                console.error("AreaID not found of this  name:", Area);
                                continue; // Skip to next iteration if branch not found
                            }
                            var AreaI
                            AreaI = AreaID.dataValues.AreaID;
                              await CustomerMasters.create({
                                UUid: uuid,
                                CompanyCode: CompanyCode,
                                AgentCode: AgentCode,
                                SuperUserID: SuperUserID,
                                CustomerName: CustomerName,
                                Guardian: Guardian,
                                LandMark: LandMark,
                                Address: Address,
                                LocalBody: LocalBody,
                                GeoLocation: GeoLocation,
                                PhoneNumber: PhoneNumber,
                                EmailId: EmailId,
                                AlternateNo: AlternateNo,
                                DOB: DOB,
                                Occupation: Occupation,
                                AplicantPhoto: AplicantPhoto,
                                Sex: Sex,
                                IdProofType: IdProofType,
                                IdProofNumber: IdProofNumber,
                                IdProofPhoto: IdProofPhoto,
                                Customersignature: Customersignature,
                                password: hashPassword,
                                Status: 1,
                                AreaID:AreaI,
                              })
                              const branch = await BranchMasters.findOne({
                                attributes: ["BranchId"],
                                where: { BranchCode: BranchCode },
                            });

                            if (!branch) {
                                console.error("Branch not found for BranchCode:", BranchCode);
                                continue; // Skip to next iteration if branch not found
                            }
                
                            BranchId = branch.dataValues.BranchId;

                                  // console.log(respAfter, "before user create");
                                  await UserMasters.create({
                                    UUid: uuid,
                                    Email: EmailId,
                                    BranchId: BranchId,
                                    PhoneNumber: PhoneNumber,
                                    Password: hashPassword,
                                    UserName: CustomerName,
                                    CompanyCode: CompanyCode,
                                    Utype: 3,
                                  })
                              
                          
                                      await sq
                                        .query(
                                          "SELECT pm.PageId, COALESCE(ud.Utype,:Utype) AS usertype, COALESCE(ud.CompanyCode,:CompanyCode) AS CompanyCode, COALESCE(ud.View,0)as ViewPage,COALESCE(ud.Add,0) AS 'Create', COALESCE(ud.Del,0) AS 'Delete', COALESCE(ud.Edit,0) AS 'Edit' FROM pagemasters pm LEFT JOIN userdefaults ud ON pm.PageId = ud.PageId AND ud.Utype = :Utype AND ud.CompanyCode=:CompanyCode;",
                                          {
                                            replacements: {
                                              Utype: Utype,
                                              CompanyCode: CompanyCode,
                                            },
                                            type: QueryTypes.SELECT,
                                          }
                                        )
                                        .then((RegRes2) => {
                                          if (RegRes2.length != 0) {
                                            var i = 0;
                                            const length = RegRes2.length;
                                            console.log("res2 er len", length);
                                            console.log(RegRes2[0].PageId);
                                            for (i = 0; i < length; i++) {
                                              // console.log(success);
                                              CustCreationPromises.push(
                                                UserPermissions.create({
                                                  CompanyCode: CompanyCode,
                                                  Utype: Utype,
                                                  UUid: uuid,
                                                  PageId: RegRes2[i].PageId,
                                                  View: RegRes2[i].ViewPage,
                                                  Add: RegRes2[i].Create,
                                                  Edit: RegRes2[i].Edit,
                                                  Del: RegRes2[i].Delete,
                                                  default: RegRes2[i].ViewPage === 1 ? 1 : 0,
                                                })
                                              );
                                            }
                                            Promise.all(CustCreationPromises)
                                              .then(async (rsp) => {
                                                // console.log("in permission then", success, rsp);
                                                // return res.status(200).json({
                                                //   errmsg: false,
                                                //   response: "Registration Successful",
                                                // });
                                              })
                                              .catch((err) => {
                                                console.log(
                                                  "in permission catch",
                                          
                                                );
                                                // success = 0;
                                                // return res.status(500).json({
                                                //   errmsg: false,
                                                //   response:
                                                //     "Registration failed due to Permission Issue",
                                                // });
                                              });
                                          

                                          } else {
                                            // return res.status(400).json({
                                            //   status: 500,
                                            //   errmsg: true,
                                            //   response: "Permisson Pages Not Set!!" + err,
                                            // });
                                          }
                                        });
                    
                

              
            }
        })();
    }
    else if(sheetName=='Area')
    {
      for(i=0;i<length;i++)
      {
          var AreaName=data[i].AreaName;
          // var PinCode=data[i].Pincode;
          // var District=data[i].District
          // var State =data[i].state;
          // var Country=data[i].country;
          // var CompanyCode=data[i].CompanyCode;

          var PinCode='700150';
          var District='South 24 Parganas'
          var State ='West Bengal'
          var Country='India';
          var CompanyCode='BJPL';          

      console.log(data[i].state,data[i].country);
          AreaMasters.create({
            AreaName: AreaName,
            CompanyCode: CompanyCode,
            Pincode: PinCode,
            District: District,
            state: State,
            country: Country,
            Status: 1,
          })
              .then((RegRes) => {
                console.log(RegRes,"SUCESS");
              //   return res.status(200).json({
              //     errMsg: false,
              //     response: "Branch Created Succssfully",
              //   });
              })
              .catch((err) => {
                console.log(err);
              //   return res.status(500).json({
              //     errMsg: false,
              //     Response: "Branch Creation failed." + err,
              //   });
              });
        
      }
    }
    else if(sheetName=='Scheme')
    {
      for(i=0;i<length;i++)
      {
          var SchemeTitle=data[i].SchemeTitle;
          var BONUS=data[i].BONUS;
          var CompanyCode=data[i].CompanyCode
          var RegFees =data[i].Regfees;
          var Duration=data[i].Duration;
          var Suuid = uuidv4();
            console.log("i am in branch",data[i].AreaId);
            SchemeMasters.create({
              SUUid: Suuid,
              CompanyCode: CompanyCode,
              SchemeTitle: SchemeTitle,
              BONUS: BONUS,
              Regfees: RegFees,
              Duration: Duration,
              Daily:1,
              Monthly:1,
              Weekly:1,
              Status: 1,
            })
              .then((RegRes) => {
                console.log(RegRes);
              //   return res.status(200).json({
              //     errMsg: false,
              //     response: "Branch Created Succssfully",
              //   });
              })
              .catch((err) => {
                console.log(err);
              //   return res.status(500).json({
              //     errMsg: false,
              //     Response: "Branch Creation failed." + err,
              //   });
              });
        
      }
    }
    else if(sheetName=='Designation')
    {
      for(i=0;i<length;i++)
      {
          var Designation=data[i].Designation;
          var CompanyCode=data[i].CompanyCode

          var uuid = uuidv4();
      
          
          designations.create({
            CompanyCode: CompanyCode,
            Designation: Designation,
            UUid: uuid,
            Status: 1,
          })
              .then((RegRes) => {
                console.log(RegRes);
              //   return res.status(200).json({
              //     errMsg: false,
              //     response: "Branch Created Succssfully",
              //   });
              })
              .catch((err) => {
                console.log(err);
              //   return res.status(500).json({
              //     errMsg: false,
              //     Response: "Branch Creation failed." + err,
              //   });
              });
        
      }
    }
    else if(sheetName=='SchemeRegister')
    {
      (async () => {
        for(i=0;i<length;i++)
        {

          console.log(data[i].CustomerPhoneno,"CustomerPhoneno");
            var StartDate;
            var regfees;
            // var date = new Date();
            var ac;
            var serial;
            var NomineeIdProofPhoto="";
            var NomineePhoto="";
            var Nomineesignature="";
            var SUUid
            var CustUUid
            var CompanyCode=data[i].CompanyCode ;
            var frequency=data[i].frequency ;
            var EMI=data[i].EMI;
            var CustomerPhoneno=data[i].CustomerPhoneno;
            var CustomerAccNo=data[i].CustomerAccNo ;
            var PassBookNo=data[i].PassBookNo;
            var StartDate=data[i].StartDate ;
            var EndDate=data[i].EndDate;
            var SchemeTitle=data[i].SchemeTitle;
            
            var  NomineeIdProofPhoto = data[i].CustomerPhoneno + ".jpg";
            var  NomineePhoto = data[i].CustomerPhoneno + ".jpg";
            var Nomineesignature = data[i].CustomerPhoneno + ".jpg";
            // var objreq = data;
   
            console.log(StartDate,EndDate,i,SchemeTitle,"SCHEME REGISTER TEST");
            const Colluuid = uuidv4();
                  const Scheme = await SchemeMasters.findOne({
                          attributes: ["SUUid"],
                          where: { SchemeTitle: SchemeTitle },
                      });
         
                      if (!Scheme) {
                        console.error("Scheme not found for SchemeTitle:", SchemeTitle);
                        continue; // Skip to next iteration if branch not found
                    }
        
                     SUUid = Scheme.dataValues.SUUid;
                    console.log(CustomerPhoneno,"SCheme");
                    const Customer = await CustomerMasters.findOne({
                      attributes: ["UUid"],
                      where: { PhoneNumber: CustomerPhoneno },
                  });
     
                  if (!Customer) {
                    console.error("Customer not found for PhoneNumber:", CustomerPhoneno);
                    continue; // Skip to next iteration if branch not found
                }
    
                CustUUid = Customer.dataValues.UUid;

                              // EndDate= addMonths(StartDate, result1.Duration);
                              //   console.log(EndDate);
                              // }
                              // if (result1[0].DurationType == "Years") {
                              //   var EndDate = new Date(StartDate);
                              //   EndDate.setFullYear(EndDate.getFullYear() + years);
                              // }
                              const parsedstartDate = moment(StartDate, "MM/DD/YY");
                              const parsedendDate = moment(EndDate, "MM/DD/YY"); 
                              console.log(parsedstartDate,"invalid date fix");
// Format the parsed date to "MM/DD/YYYY" format
                              // StartDate   = StartDate.format("DD/MM/YYYY");
                              // EndDate=EndDate.format("DD/MM/YYYY")
                              const formattedStartDate = parsedstartDate.format("YYYY-MM-DD");
                              const formattedEndDate=parsedendDate.format("YYYY-MM-DD")
                              console.log(formattedStartDate,formattedEndDate);
                              await sq
                                .query(
                                  "INSERT INTO `schemeregisters`(`SUUid`, `CompanyCode`, `UUid`, `StartDate`, `EndDate`, `BonusStatus`,`MaturityStatus`,`AcSerial`,`CustomerAccNo`,`EMI`,`frequency`,`RegfeesTaken`) VALUES (:SUUid,:CompanyCode,:uuid,:StartDate,:EndDate,1,1,0,:ac,:EMI,:frequency,1)",
                                  {
                                    replacements: {
                                      SUUid: SUUid,
                                      CompanyCode: CompanyCode,
                                      uuid: CustUUid,
                                      StartDate: formattedStartDate,
                                      EndDate: formattedEndDate,
                                      ac: CustomerAccNo,
                                      EMI: EMI,
                                      frequency: frequency,
                                      
     
                                    },
                                    type: QueryTypes.INSERT,
                                  }
                                )
        }
    })();
    }
    else if(sheetName=='Monthly_transaction')
    {
      (async () => {
        for(i=0;i<length;i++)
        {
            var StartDate;
            var regfees;
            // var date = new Date();
            var ID;
            var serial;
            var NomineeIdProofPhoto="";
            var NomineePhoto="";
            var Nomineesignature="";
            var SUUid
            var CustUUid
            var CompanyCode=data[i].CompanyCode ;
            var CollectedAmt=data[i].ActualCollection ;
            var CollDate
            var CustomerAccNo=data[i].CustomerAccNo ;
            var PassBookNo=data[i].PassBookNo;
            var month=data[i].Month ;
            var actualmnth
            var ID
            var UUid
            const Colluuid = uuidv4();
            actualmnth= convertDate(month);
            console.log(actualmnth,"test");
           
            const parsedDate = moment(actualmnth, "MM-YYYY");

// Add a day to the parsed date and change the year
            const convertedDate = '2025-01-16'
            console.log(convertedDate,"test1",data[i].ActualCollection);
           const sr= await SchemeRegisters.findOne({
            attributes: ["UUid","ID","SUUid"],
            where: { CustomerAccNo: CustomerAccNo },
        });
           
        if (!sr) {
          console.error("Scheme not found for CustomerAccNo:", CustomerAccNo);
          continue; // Skip to next iteration if branch not found
      }   
      CustUUid = sr.dataValues.UUid;
      ID=sr.dataValues.ID;
      SUUid=sr.dataValues.SUUid;

    const agentcode= await CustomerMasters.findOne({
        attributes: ["AgentCode","AreaID"],
        where: { 	UUid: CustUUid },
    });
       
    if (!agentcode) {
      console.error("Agent not found for CustomerAccNo:", CustomerAccNo);
      continue; // Skip to next iteration if branch not found
  } 
  var code=agentcode.dataValues.AgentCode
  var AreaID=agentcode.dataValues.AreaID

  const agentid= await AgentMasters.findOne({
    attributes: ["UUid"],
    where: { 	AgentCode: code },
});
   
if (!agentid) {
  console.error("Agent not found for CustomerAccNo:", CustomerAccNo);
  continue; // Skip to next iteration if branch not found
} 
UUid=agentid.dataValues.UUid
CollectedAmt = parseFloat(CollectedAmt);
console.log(CollectedAmt,"VALUE CHECK");

await EmiTrans.create({
  CollectionUUId: Colluuid,
  AgentUUid: UUid,
  CustomerUUid: CustUUid,
  CollDate: convertedDate,
  CollectedAmt: CollectedAmt,
  PaymentMode: 1,
  SchemeRegId: ID,
  PaymentType: 2,
  PaymentStatus: 3,
  CompanyCode: CompanyCode,
  AreaID:AreaID
})


await MonthlyTrans.create({
  CompanyCode: CompanyCode,
  SchemeRegId: ID,
  Month: actualmnth,
  ExpectedCollection: CollectedAmt,
  ActualCollection: CollectedAmt,
  WalletBalance: 0,
})
  


        }
    })();
    }
    else if(sheetName=='PassBook')
    {
      (async () => {
        for(i=0;i<length;i++)
        {
          var PassBookNo= data[i].PassBookNo;
          var CompanyCode=data[i].CompanyCode;
          var BranchCode=data[i].BranchCode;
          var AgentCode=data[i].AgentCode;
          var CustomerPhoneno=data[i].CustomerPhoneno;
          var CustomerAccNo=data[i].CustomerAccNo;
          var Status=data[i].Status;
          var CustId='';
          var AgentId='';
        console.log(i,"PASS CHECK 01");
        if (Status=='Customer')
        {
          const customer=await CustomerMasters.findOne({
            attributes: ["CustomerID"],
            where: { PhoneNumber: CustomerPhoneno },
          })  

          if (!customer) {
            console.error("customer not found for PhoneNumber:", CustomerPhoneno);
            continue; // Skip to next iteration if branch not found
        } 
         CustId=customer.dataValues.CustomerID
      }
      if(Status=='Agent' || Status=='Customer')
      {
        const Agent=await AgentMasters.findOne({
          attributes: ["AgentID"],
          where: { AgentCode: AgentCode },
        })  

              if (!Agent) {
                console.error("Agent not found for AgentCode:", AgentCode);
                continue; // Skip to next iteration if branch not found
            } 
             AgentId=Agent.dataValues.AgentID
              console.log(AgentId,i,"Pass Check",Status,length);
        }
      const Barnch=await BranchMasters.findOne({
        attributes: ["BranchId"],
        where: { BranchCode: BranchCode },
      })  

      if (!Barnch) {
        console.error("Barnch not found for BarnchCode:", BranchCode);
        continue; // Skip to next iteration if branch not found
    } 
    var BranchId=Barnch.dataValues.BranchId

      if (Status=='Customer')
      {
        var  St= 2
        console.log(AgentId,"agent Check");
        await PassBookMaster.create({
          CompanyCode: CompanyCode,
          BranchId: BranchId,
          PassBookNo:PassBookNo,
          CustomerID:CustId,
          CustomerAccNo:CustomerAccNo,
          AgentId:AgentId,
          Status: St
        })
  
      }
      else if(Status=='Agent')
      {
        var  St= 1
        console.log(AgentId,"agent Check");
        await PassBookMaster.create({
          CompanyCode: CompanyCode,
          BranchId: BranchId,
          PassBookNo:PassBookNo,
          AgentId:AgentId,
          Status: St
        })
      }
      else
      {

        var  St= 3
        await PassBookMaster.create({
          CompanyCode: CompanyCode,
          BranchId: BranchId,
          PassBookNo:PassBookNo,
          Status: St
        })
      
      }

        }
    })();
    }
  }
catch (error) {
    console.error("Error reading Excel file:", error);
}
