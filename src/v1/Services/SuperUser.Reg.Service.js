const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { SuperUserMasters } = require("../Model/SuperUserMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const http = require('http');
const crypto = require('crypto');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class SuperRegService {
  async SuperReg(req, res, next) {
    console.log(req.body, "in suoer reg service");
    function generateRandomPassword(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?';
      let password = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        password += chars[randomIndex];
      }
    
      return password;
    }
    try {
      var date = new Date();
      // console.log(date);
      const EmailId = req.body.EmailId || null;
      const Name = req.body.Name;
      const Phonenumber = req.body.PhoneNumber;
      var password ;
      const UserID = req.body.LoggerID;
      const UseruuID = req.body.LoggerUUid;
      const DID = req.body.Did;
      const BranchCode = req.body.BranchId;
      const CompanyCode = req.body.CompanyCode;
      const IDProofType=req.body.IdProoftype;
      const IDProofNumber=req.body.IdProofNumber;
      const Photo = req.body.PhoneNumber + ".jpg";
      var IdProofPic = req.body.PhoneNumber + ".jpg";
      var Signature = req.body.PhoneNumber + ".jpg";
      var SUtype=req.body.SUtype;
      var Sex=req.body.Sex;
      const Utype = 1;
      const uuid = uuidv4();
      const length = 7; // Length of the password
    //  password = generateRandomPassword(length);
       password='Abc@123';
console.log(password,"Pass Check");
      const hashPassword = bcrypt.hashSync(password, Pwd);
      console.log(hashPassword, "pass");

      const DBConnection = await sq.sync().then(async () => {
        UserMasters.findAll({
          where: {
            CompanyCode: CompanyCode,
            UUid: UseruuID,
          },
        }).then((Result) => {
          console.log(Result, "RST1");
          if (Result.length != 0) {
            UserMasters.findAll({
              where: {
                PhoneNumber: Phonenumber,
              },
            })
              .then(async (result) => {
                console.log(result, "RST2");
                if (result.length == 0) {
                  UserMasters.findAll({
                    where: {
                      UserID: UserID,
                    },
                  }).then((rst) => {
                    console.log(rst, UserID, hashPassword, "RST3");
                    if (rst.length != 0) {
                      SuperUserMasters.create({
                        UUid: uuid,
                        CompanyCode: CompanyCode,
                        Name: Name,
                        DID: DID,
                        PhoneNumber: Phonenumber,
                        EmailId: EmailId,
                        Password: hashPassword,
                        Photo: Photo,
                        Status: 3,
                        IdPhoto: IdProofPic,
                        Signature: Signature,
                        IDProofType:IDProofType,
                        IDProofNumber:IDProofNumber,
                        SuperUserType:SUtype,
                        Sex:Sex
                      })
                        .then(async (RegRes) => {
                          console.log(RegRes, hashPassword, "RST3");
                          console.log("I am in then of usermaster create");
                          UserMasters.create({
                            UUid: uuid,
                            Eamil: EmailId,
                            PhoneNumber: Phonenumber,
                            Password: hashPassword,
                            UserName: Name,
                            CompanyCode: CompanyCode,
                            Utype: Utype,
                            BranchId: BranchCode,
                          })
                            .then(async (RegRes1) => {
                              // console.log(RegRes1);
                              console.log(RegRes1, hashPassword, "RST3");
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
                                  var url = '';
                                  url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
                                  url=url+'&mobile=+91'+Phonenumber+'&message=Welcome to Bangasree Jewellers. Your Sonar Kella account is now active. Login to www.bangasreejewellers.com to check your account details and balance. Your account details are below: A/c no.'+ Phonenumber +' Login ID:'+ Phonenumber + 'Password:'+ password +' For any query, please call 8585802375 or visit your nearest branch/office. Regards, Bangasree Jewellers&senderid=BJ25SB&accusage=1&entityid=1201170685649952029&tempid=1207171023669218919'
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
                                  //  console.error(`Error: ${error.message}`);
                                  });
                                  return res.status(200).json({
                                    errMsg: false,
                                    response: "Registration successful",
                                  });

                                });
                            })
                            .catch((err) => {
                              console.log(err);
                              return res.status(400).json({
                                errMsg: false,
                                response: "Registration failed." + err,
                              });
                            });
                        })
                        .catch((err) => {
                          console.log(err);
                          return res.status(400).json({
                            errMsg: false,
                            response: "Registration failed.",
                            msg: err,
                          });
                        });
                    }
                  });
                } else {
                  return res
                    .status(400)
                    .json({ errMsg: true, response: "Already  Registered" });
                }
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({ errMsg: true, response: err });
              });
          } else {
            return res.status(400).json({
              status: 500,
              errmsg: true,
              response: "UnAuthorized Request!!",
            });
          }
        });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new SuperRegService();
