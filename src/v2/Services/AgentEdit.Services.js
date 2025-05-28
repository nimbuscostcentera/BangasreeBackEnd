const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { QueryTypes } = require("sequelize");
const { SchemeMasters } = require("../Model/SchemeMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);

class AgentEditService {
  async AgentEdit(req, res, next) {
    console.log("\n service agentlatest:", req.body);
      try
    {   

      console.log("in try");
        const {
          AgentID,
          AgentCode,
          UUid,
          CompanyCode,
          SuperUserID,
          Name,
          Address,
          Geolocation,
          Phonenumber,
          EmailId,
          BankName,
          AccountType,
          AccountNumber,
          IFSCCode,
          MICR,
          NomineeName,
          Relation,
          Dob,
          Sex,
          IDProof,
          Photo,
          Commision,
          PassbookStatus,
          Status,
          IDProofPhoto,
          Signature,
          IDProofType,
          IDProofNumber,
          BranchId,
          AreaID
        } = req.body;  
          const DBConnection = await sq.sync().then(async () => {
            console.log("test check",req.body.Dob);
              await AgentMasters.update(
                {
                  SuperUserID: SuperUserID,
                  Name: Name,
                  Address: Address,
                  Geolocation: Geolocation,
                  Phonenumber: Phonenumber,
                  EmailId: EmailId,
                  BankName: BankName,
                  AccountType: AccountType,
                  AccountNumber: AccountNumber,
                  IFSCCode: IFSCCode,
                  MICR: MICR,
                  NomineeName: NomineeName,
                  Relation: Relation,
                  DOB: Dob,
                  Sex: Sex,
                  IDProof: IDProof,
                  Commision: Commision,
                  PassbookStatus: PassbookStatus,
                  Status: Status,
                  Photo: `${Phonenumber}.jpg`,
                  IDProofPhoto: `${Phonenumber}.jpg`,
                  Signature: `${Phonenumber}.jpg`,
                  IDProofType: IDProofType,
                  IDProofNumber: IDProofNumber,
                  AreaID: AreaID,
                },
                { where: { AgentID: AgentID } }
              )
                .then(async (resp) => {
                 
                  await AgentMasters.findAll({
                    attributes: ["uuid"],
                    where: {
                      agentid: AgentID,
                    },
                  }).then(async (uuids) => {
                    console.log(uuids[0].dataValues.uuid);
                    await UserMasters.update(
                      {
                        BranchId: BranchId,
                        UserName: Name,
                        PhoneNumber: Phonenumber,
                        Email: EmailId,
                      },
                      {
                        where: {
                          UUid: uuids[0].dataValues.uuid,
                        },
                      }
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
                  });
                })
                .catch((err) => {
                  console.log(err, "error");
                  return res.status(500).json({ errmsg: true, response: err });
                });
          }).catch((err) => { return res.status(500).json({ errmsg: true, response: err }); });
          return DBConnection;
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = new AgentEditService();
