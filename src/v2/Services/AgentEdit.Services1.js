const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class AgentEditService1 {
  async AgentEdit(req, res, next) {
    // let {email , AgentCode = null} = req.body
    console.log("\nservice:",req.body);
     try {
       const Email = req.body.email || null;
       const AgentCode = req.body.AgentCode;
       const superid = req.body.SuperUserID;
       const Aname = req.body.Name;
       const Add = req.body.Address;
       const loc = req.body.loc || null;
       const Phno = req.body.PhoneNumber;
    //    const pass = req.body.Password;
       const Bank = req.body.BankName;
       const AccType = req.body.AccountType;
       const AccNo = req.body.AccountNo;
       const Ifscno = req.body.Ifscno;
       const MICR = req.body.MICR || null;
       const NmName = req.body.NomineeName || null;
       const Relation = req.body.Relation || null;
       const DOB = req.body.Dob;
       const sx = req.body.Sex;
       const Id = req.body.IDProof;
       const pic = req.body.photo;
       const status= req.body.status;
       const AgentID = req.query.agentid;
    //    console.log(pass);
    //    const hashPassword = bcrypt.hashSync(pass, Pwd);
    //    console.log(hashPassword);

       const DBConnection = await sq.sync().then(async () => {
         const agent = await AgentMasters.findByPk(AgentID);
         console.log(agent);
        if (agent)
        {
            agent.EmailId= Email;
            agent.AgentCode= AgentCode;
            agent.CompanyCode= "BGPL";
            agent.SuperUserID= superid;
            agent.Name= Aname;
            agent.Address= Add;
            agent.Geolocation= loc;
            agent.Phonenumber= Phno;
           //  password: hashPassword,
            agent.BankName= Bank;
            agent.AccountType= AccType;
            agent.AccountNumber= AccNo;
            agent.IFSCCode= Ifscno;
            agent.MICR= MICR;
            agent.NomineeName= NmName;
            agent.Relation= Relation;
            agent.DOB= DOB;
            agent.Sex= sx;
            agent.IDProof= Id;
            agent.Photo= pic;
            agent.Status=status
            await agent.save().then((RegRes) => {
                console.log(RegRes);
                return res.status(200).json({
                  errMsg: false,
                  Response: "Edit Succssfull."
                });
              }).catch((err) => {
                return res.status(500).json({
                  errMsg: false,
                  Response: "Edit failed." + err,
                });
              });

        }
            //    AgentMasters.update({
            //    })
       });
       return DBConnection;
     }
     catch (error) {
       console.log(error);
       return res.status(500).json({ errMsg: true, response: err });
     }
  }
}
module.exports = new AgentEditService1();
