const {sq}=require("../../config/ormdb")
const { AgentMasters } = require("../DataBase/AgentMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class RgstrAgntService{
  async AgentCreate(req, res, next){ 
   try{
    const Email = req.body.email;
    const AgentCode = req.body.AgentCode;
    const superid=req.body.SuperUserID;
    const Aname=req.body.Name;
    const Add=req.body.Address;
    const loc=req.body.loc;
    const Phno=req.body.PhoneNumber;
    const pass=req.body.Password;
    const regdt=req.body.RegistrationDate;
    const Bank=req.body.BankName;
    const Actyp=req.body.AccountType;
    const Acno=req.body.AccountNo;
    const Ifscno=req.body.Ifscno;
    const MICR=req.body.MICR;
    const NmName=req.body.NomineeName;
    const Relation=req.body.Relation;
    const DOB=req.body.Dob;
    const sx=req.body.Sex;
    const Id=req.body.IDProof;
    const pic=req.body.photo;
    const Cmsn=req.body.Commision;
    const Pstats=req.body.PassbookStatus;
    const Stats=req.body.Status;
  
     console.log(pass);
    const hashPassword = bcrypt.hashSync(pass, Pwd);
    console.log(hashPassword);
    // sq.sync().then(() => 
    const agentvalid =await sq.sync().then(async() => {
        console.log(hashPassword); 
        AgentMasters.findAll({
              where: {
                // EmailId: Email
                EmailId:  Email,
              },
            }).then((result) => {
              if (result.length === 0) {
                 console.log("before create");
                 console.log(hashPassword);
                const Ag1 = AgentMasters.create({
                  UUid: uuidv4(),
                  AgentCode :AgentCode,
                  CompanyCode: "BGPL",
                  SuperUserID : superid,
                  Name: Aname,
                  Address:Add,
                  Geolocation:loc,
                  Phonenumber:Phno,
                  EmailId:Email,
                  // RegistrationDate:regdt,
                  BankName:Bank,
                  AccountType:Actyp,
                  AccountNumber:Acno,
                  IFSCCode:Ifscno,
                  MICR:MICR,
                  NomineeName:NmName,
                  Relation:Relation,
                  DOB:DOB,
                  Sex:sx,
                  IDProof:Id,
                  Photo:pic,
                  Commision:Cmsn,
                  PassbookStatus:Pstats,
                  password:hashPassword,
                  Status:Stats,
                  });      
                // return res.status(200).json({ Msg: true, message: "Registration Succssfull" });
                console.log("Registration done");
               
              }
              else{
                return res.status(400).json({ errMsg: true, message: "Already  Registered" });
              }
            })

            .catch((err) => {
              console.log(err);
                      
            });

      });

   }
   catch (error) {
    return res.status(error?.status || 500).json({ status: "FAILED", data: { error: error?.message || error } });
  }
};
}
module.exports = new RgstrAgntService()