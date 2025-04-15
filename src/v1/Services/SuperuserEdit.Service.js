const { sq } = require("../../DataBase/ormdb");
const { SuperUserMasters } = require("../Model/SuperUserMaster.Model");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const {CustomerMasters}=require("../Model/CustomerMaster.Model");
const {UserMasters}=require("../Model/UserMaster.Model");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);

class SuperuserEditService {
  async EditSuperUser(req, res, next) {
   
      try
    {
        const {
          SuperUserID,
          Name,
          PhoneNumber,
          EmailId,
          Status,
          UUid,
          SuperUUid,
          BranchId,
          IDProofType,
          IDProofNumber,
          Did,
          SUtype,
          Sex
        } = req.body;  
        if (req.body.PhoneNumber != undefined && req.body.PhoneNumber != null && req.body.PhoneNumber != "" )
        {
          var Photo = req.body.PhoneNumber + ".jpg";
          var IdProofPic = req.body.PhoneNumber + ".jpg";
          var Signature = req.body.PhoneNumber + ".jpg";
        }

        console.log(" service1:", req.body); 
              await SuperUserMasters.update(
                {
                  SuperUserID: SuperUserID,
                  Name: Name,
                  PhoneNumber: PhoneNumber,
                  EmailId: EmailId,
                  Photo: `${PhoneNumber}.jpg`,
                  IdPhoto: `${PhoneNumber}.jpg`,
                  Signature: `${PhoneNumber}.jpg`,
                  Status: Status,
                  IDProofType: IDProofType,
                  IDProofNumber: IDProofNumber,
                  DID: Did,
                  SuperUserType: SUtype,
                  Sex: Sex,
                },
                { where: { UUid: UUid } }
              )
                .then(async (resp) => {
                  await UserMasters.update(
                    {
                      BranchId: BranchId,
                    },
                    { where: { UUid: UUid } }
                  )
                    .then(async (rst) => {
                      return res.status(200).json({
                        errmsg: false,
                        response: "Data Successfully Updated",
                      });
                    })
                    .catch((err) => {
                      return res
                        .status(500)
                        .json({ errmsg: true, response: err });
                    });
                })
                .catch((err) => {
                  console.log(err, "1");
                  return res.status(500).json({ errmsg: true, response: err });
                });
        
       
    }
    catch (err) {
      console.log(err,"error");
    }
  }

  async DeleteSuperUser(req, res, next) {
    console.log("\n service:", req.body);
      try
    {
        const {
          SuperUserID,
          Name,
          PhoneNumber,
          EmailId,
          Photo,
          Status,
          UUid,
          BranchId
        } = req.body;  
    
              await SuperUserMasters.destroy(
                { where: { UUid: UUid } }
              )
                .then(async (resp) => {
                  
                    await UserMasters.destroy(
                        { where: { UUid: UUid } }
                      ) 
                      .then(async (rst) => { 
                  return res
                    .status(200)
                    .json({ errmsg: false, response: "User Successfully Deleted" });
                      })
                      .catch((err) => {
                        return res.status(500).json({ errmsg: true, response: err });
                      });
                })
                .catch((err) => {
                    return res.status(500).json({ errmsg: true, response: err });
                });
        
       
    }
    catch (err) {
      console.log(err);
    }
  }

  async DeleteAgent(req, res, next) {
    console.log("\n service:", req.body);
      try
    {
        const {
          SuperUserID,
          Name,
          PhoneNumber,
          EmailId,
          Photo,
          Status,
          UUid,
          BranchId
        } = req.body;  
    
              await AgentMasters.destroy(
                { where: { UUid: UUid } }
              )
                .then(async (resp) => {
                  
                    await UserMasters.destroy(
                        { where: { UUid: UUid } }
                      ) 
                      .then(async (rst) => { 
                  return res
                    .status(200)
                    .json({ errmsg: false, response: "User Successfully Deleted" });
                      })
                      .catch((err) => {
                        return res.status(500).json({ errmsg: true, response: err });
                      });
                })
                .catch((err) => {
                    return res.status(500).json({ errmsg: true, response: err });
                });
        
       
    }
    catch (err) {
      console.log(err);
    }
  }
  
  async DeleteCustomer(req, res, next) {
    console.log("\n service:", req.body);
      try
    {
        const {
          SuperUserID,
          Name,
          PhoneNumber,
          EmailId,
          Photo,
          Status,
          UUid,
          BranchId
        } = req.body;  
    
              await CustomerMasters.destroy(
                { where: { UUid: UUid } }
              )
                .then(async (resp) => {
                  
                    await UserMasters.destroy(
                        { where: { UUid: UUid } }
                      ) 
                      .then(async (rst) => { 
                  return res
                    .status(200)
                    .json({ errmsg: false, response: "User Successfully Deleted" });
                      })
                      .catch((err) => {
                        return res.status(500).json({ errmsg: true, response: err });
                      });
                })
                .catch((err) => {
                    return res.status(500).json({ errmsg: true, response: err });
                });
        
       
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = new SuperuserEditService();
