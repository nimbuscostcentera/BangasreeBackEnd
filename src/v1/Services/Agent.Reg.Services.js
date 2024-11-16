const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const Pwd = bcrypt.genSaltSync(10);
class AgentRegService {
  async AgentReg(req, res, next) {
    console.log(req.body,"requst agent reg");
    try {
      var date = new Date();
      var AgentCode;
      var serial;
      // console.log(date);
      const EmailId = req.body.EmailId || null;
      const BranchCode = req.body.BranchCode;
      const SuperUserID = req.body.SuperUserID;
      const Name = req.body.Name;
      const Address = req.body.Address;
      const Geolocation = req.body.Geolocation || null;
      const Phonenumber = req.body.Phonenumber;
      // const password = req.body.password;
      const BankName = req.body.BankName; 
      const AccountNumber = req.body.AccountNumber;
      const IFSCCode = req.body.IFSCCode;
      const MICR = req.body.MICR || null;
      const NomineeName = req.body.NomineeName || null;
      const Relation = req.body.Relation || null;
      const DOB = req.body.DOB;
      const Sex = req.body.Sex;
      const Photo = req.body.Phonenumber+".jpg";
      const AccountType = req.body.AccountType;
      const CompanyCode = req.body.CompanyCode;
      const IDProofPhoto = req.body.Phonenumber+".jpg";
      const Signature = req.body.Phonenumber+".jpg";
      console.log(req.body.IdProofType,req.body,"type req");
      const IDProofType = req.body.IDProofType;
      const IDProofNumber = req.body.IDProofNumber;
     
      const UserID=req.body.UserID;
      const BranchId=req.body.BranchId;
      const Commision=req.body.Commision;
      const AreaID=req.body.AreaID;      
     
      const Utype = 2;
      const uuid = uuidv4();
      const password="Abc@123"
      const hashPassword = bcrypt.hashSync(password, Pwd);
      console.log(hashPassword);
      // const { DIRProfilePhoto  } = require("../Images/Agent/ProfilePhoto");
      // const { DIRIdProof  } = require("../Images/Agent/IdProof");
      // const { DIRSignature  } = require("../Images/Agent/Signature");
      const DBConnection = await sq.sync().then(async () => {


        UserMasters.findAll({
          where: {
            CompanyCode: CompanyCode,
          },
        }).then((Result) => {
          if (Result.length != 0) {
            UserMasters.findAll({
              where: {
                PhoneNumber: Phonenumber,
              },
            })
              .then(async (result) => {
                if (result.length == 0) {
                  sq.query("SELECT max(AcSerial) as asrl FROM `agentmasters`",{type: QueryTypes.SELECT})
                  .then(async(srl)=>{
                        
                    if (srl[0].asrl==0)
                    {
                      
                       serial='0001'
                    }
                    else
                    {
                       serial=Number(srl[0].asrl)+1
                       serial=serial.toString();
                       while (serial.length < 4) {
                        serial = '0' + serial;
                        }
                    }
                // StartDate = date; 
                // var mnth=StartDate.getMonth()+1;
                // var yr=StartDate.getFullYear().toString();
                // yr=yr.substring(2);
                var cmp="BJ"
               
                const nameArray = Name.split(" ");
                const firstInitial = nameArray[0] ? nameArray[0].charAt(0).toUpperCase() : '';
                const lastInitial = nameArray[nameArray.length - 1] ? nameArray[nameArray.length - 1].charAt(0).toUpperCase() : '';
                AgentCode=cmp+firstInitial+lastInitial+serial;
                console.log(AgentCode,"Code");
                console.log(IDProofType,"type");
                // const storage1 = multer.diskStorage({
                //   destination: (req, Photo, cb) => {
                //   cb(null, DIRProfilePhoto);
                //   },
                //   filename: (req, Photo, cb) => {
                //     const fileName = uuid+".jpg";
                //     cb(null, uuidv4() + '-' + fileName)
                //   }
                // });
                // var upload = multer({
                //   fileFilter: (req, Photo, cb) => {
                //   if (Photo.mimetype == "image/png" || Photo.mimetype == "image/jpg" || Photo.mimetype == "image/jpeg") {
                //   cb(null, true);
                //   } else {
                //   cb(null, false);
                //   return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
                //   }
                //   }
                //   });
                console.log(SuperUserID,IDProofType,"check super");
                  AgentMasters.create({
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
                    AcSerial:serial,
                    Commision:Commision,
                    Status: 3,
                    AreaID:AreaID,
                  })
                    .then(async (RegRes) => {
                      console.log("I am in then of usermaster create",BranchId);
                      UserMasters.create({
                        UUid: uuid,
                        Eamil: EmailId,
                        PhoneNumber: Phonenumber,
                        Password: hashPassword,
                        UserName: Name,
                        CompanyCode: CompanyCode,
                        Utype: Utype,
                        BranchId:BranchId,
                      })
                        .then(async (RegRes1) => {
                          console.log(RegRes1);
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
                                console.log(RegRes2);
                              return res.status(200).json({
                                errMsg: false,
                                response: "Registration successful",
                              });
                            });
                        })
                        .catch((err) => {
                          console.log(err,"in error");
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
                        response: "Registration failed." + err,
                        msg: err,
                      });
                    });
                 
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
      return res.status(500).json({ errMsg: true, response: error });
    }
  }
}
module.exports = new AgentRegService();
