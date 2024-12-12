const {sq}=require("../../config/ormdb")
const { CustomerMasters } = require("../DataBase/CustomerMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class RgstrCustService{
  async CustomerCreate(req, res, next){ 
   try{
    const Email = req.body.email;
    const superid=req.body.SuperUserID;
    const Aname=req.body.Name;
    const Add=req.body.Address;
    const lob=req.body.LocalBody;                            
    const Phno=req.body.PhoneNumber;
    const pass=req.body.Password;
    const NmName=req.body.NomineeName;
    const Relation=req.body.Relation;
    const DOB=req.body.Dob;
    const sx=req.body.Sex;
    const pic=req.body.photo;
    const Stats=req.body.Status;
    const Gname=req.body.Gurdian;
    const Altno=req.body.AlternateNo;
    const occu=req.body.occupation;
    const idtyp=req.body.IdProofType;
    const IdPhoto=req.body.Idphoto;
    const NomIdtyp=req.body.NomineeIdProofType;
    const NomIdPhoto=req.body.NomineeIdPhoto;
    const NomPic=req.body.NomineePhoto;
    const Sign=req.body.Signature;
    const acode=req.body.AgentCode; 
  
     console.log(pass);
    const hashPassword = bcrypt.hashSync(pass, Pwd);
    console.log(hashPassword);
    // sq.sync().then(() => 
    const agentvalid =await sq.sync().then(async() => {
        console.log(hashPassword); 
        CustomerMasters.findAll({
              where: {
                // EmailId: Email
                EmailId:  Email,
              },
            }).then((result) => {
              if (result.length === 0) {
                 console.log("before create");
                 console.log(hashPassword);
                const Ag1 = CustomerMasters.create({
                  UUid: uuidv4(),
                  CompanyCode: "BGPL",
                  AgentCode :acode,
                  SuperUserID : superid,
                  Name: Aname,
                  Gurdian:Gname,
                  Address:Add,
                  LocalBody:lob,
                  Phonenumber:Phno,
                  EmailId:Email,
                  AlternateNo:Altno,
                  DOB:DOB,
                  Occupation:occu,
                  Nomineename:NmName,
                  Relation:Relation,
                  Sex:sx,
                  IdProofType:idtyp,
                  IdProofPhoto:IdPhoto,
                  NomineeIdProofType:NomIdtyp,
                  NomineeIdProofPhoto:NomIdPhoto,
                  Photo:pic,
                  NomineePhoto:	NomPic,
                  Customersignature:Sign,
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
module.exports = new RgstrCustService()