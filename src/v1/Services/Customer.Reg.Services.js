const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { ProabableCustomers } = require("../Model/ProabableCustomer.Model");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { v4: uuidv4 } = require("uuid");
const http = require('http');
const bcrypt = require("bcryptjs");
var success = null;
// const { SELECT } = require("sequelize/types/query-types");
const Pwd = bcrypt.genSaltSync(10);
class CustomerRegService {
  async CustomerReg(req, res, next) {
    console.log(req.body);
    
    var ac;
    var serial;
    var date = new Date();
    var StartDate;
    var Utype = 3;
    var EndDate;
    var LeadId = "";
    var regfees;
    const {
      SuperUserID,
      AgentCode,
      CustomerName,
      Guardian,
      Address,
      LocalBody,
      LandMark = null,
      GeoLocation = null,
      PhoneNumber,
      AlternateNo = null,
      EmailId = null,
      DOB,
      Occupation,
      Sex,
      IdProofType,
      IdProofNumber,
      CompanyCode,
      SUUid,
      AgentUUid,
      BranchId,
      AreaID
    } = req.body;
    if (
      req.body.LeadId != "" &&
      req.body.LeadId != null &&
      req.body.LeadId != "undefined"
    ) {
      LeadId = req.body.LeadId;
    }
    
    var IdProofPhoto = req.body.PhoneNumber + ".jpg";
    var AplicantPhoto = req.body.PhoneNumber + ".jpg";
    var Customersignature = req.body.PhoneNumber + ".jpg";
    var  NomineeIdProofPhoto = req.body.PhoneNumber + ".jpg";
    var  NomineePhoto = req.body.PhoneNumber + ".jpg";
    var Nomineesignature = req.body.PhoneNumber + ".jpg";
    const uuid = uuidv4();
    var password = "Abc@123";
    const CustCreationPromises = [];
    const hashPassword = bcrypt.hashSync(password, Pwd);
    // const Colluuid = uuidv4();
    console.log(req.body, hashPassword);
    // sq.sync().then(() =>
    const AgentRegRes = await sq
      .sync()
      .then(async (response) => {
        console.log(hashPassword);
        await UserMasters.findAll({
          where: {
            PhoneNumber: PhoneNumber,
          },
        })
          .then(async (result1) => {
            console.log(result1, "hello");
            if (result1.length == 0) {
              console.log("before create", serial);
              if (LeadId != "" || LeadId == undefined || LeadId == null) {
                await ProabableCustomers.destroy({
                  where: { CustomerID: LeadId },
                });
              }
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
                AreaID:AreaID,
                Status: 3,
              })
                .then(async (respAfter) => {
                  console.log(respAfter, "before user create");
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
                    .then(async (schemreg) => {
                      console.log(schemreg, "permisson");
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
                              console.log(success);
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
                                console.log("in permission then", success, rsp);
                           
                                return res.status(200).json({
                                  errmsg: false,
                                  response: "Registration Successful",

                                });
                                
                              })
                              .catch((err) => {
                                console.log(
                                  "in permission catch",
                                  success,
                                  err
                                );
                                success = 0;
                                return res.status(500).json({
                                  errmsg: false,
                                  response:
                                    "Registration failed due to Permission Issue",
                                });
                              });
                            console.log(success, "amar torof theke msg");
                            if (success === 1) {
                              return res.status(200).json({
                                errmsg: false,
                                response: "Registration Successful",
                              });
                            } else if (success === 0) {
                              return res.status(500).json({
                                errmsg: false,
                                response:
                                  "Registration failed due to Permission Issue",
                              });
                            }
                          } else {
                            return res.status(400).json({
                              status: 500,
                              errmsg: true,
                              response: "Permisson Pages Not Set!!" ,
                            });
                          }
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.status(400).json({
                        errMsg: false,
                        response: "Registration failed" ,
                        err,
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(400).json({
                    errMsg: false,
                    response: "Registration failed" ,
                    err,
                  });
                });
            } else {
              return res.status(400).json({
                errMsg: true,
                response: "Customer Already Exists",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    return AgentRegRes;
  }
}
module.exports = new CustomerRegService();
