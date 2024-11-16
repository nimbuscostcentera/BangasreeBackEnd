const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { ProabableCustomers } = require("../Model/ProabableCustomer.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class LaedRegService {
  async LeadReg(req, res, next) {
    console.log(req.body);
    try {
      const {
        AgentCode,
        SuperUserID,
        CustomerName,
        Guardian,
        Address,
        LocalBody = null,
        LandMark = null,
        GeoLocation = null,
        PhoneNumber,
        AlternateNo = null,
        EmailId = null,
        DOB = null,
        Occupation,
        Sex = null,
        IdProofType = null,
        IdProofNumber = null,
        IdProofPhoto = null,
        AplicantPhoto = null,
        Customersignature = null,
        Nomineename = null,
        Relation = null,
        NomineeIdProofType = null,
        NomineeIdProofNumber = null,
        NomineeIdProofPhoto = null,
        NomineePhoto = null,
        Nomineesignature = null,
        CompanyCode,
        BranchId,
        FollowUpDate,
        AreaID
      } = req.body;
      const uuid = uuidv4();
      // const hashPassword = bcrypt.hashSync(password, Pwd);
      // console.log(hashPassword);
      // sq.sync().then(() =>
      const AgentRegRes = await sq
        .sync()
        .then(async (response) => {
          // console.log(hashPassword);
          console.log("connected", response);
          UserMasters.findAll({
            where: {
              PhoneNumber: PhoneNumber,
            },
          })
            .then((result) => {
              if (result.length === 0) {
                ProabableCustomers.findAll({
                  where: {
                    PhoneNumber: PhoneNumber,
                  },
                }).then((rst) => {
                  if (rst.length === 0) {
                    console.log("in laed reg");
                    // console.log(result1[0].DurationType)                  // console.log(StartDate,EndDate,"Scheme date");
                    ProabableCustomers.create({
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
                      Relation: Relation,
                      Sex: Sex,
                      IdProofType: IdProofType,
                      IdProofNumber: IdProofNumber,
                      IdProofPhoto: IdProofPhoto,
                      Nomineename: Nomineename,
                      NomineeIdProofNumber: NomineeIdProofNumber,
                      NomineeIdProofType: NomineeIdProofType,
                      NomineeIdProofPhoto: NomineeIdProofPhoto,
                      NomineePhoto: NomineePhoto,
                      Nomineesignature: Nomineesignature,
                      Customersignature: Customersignature,
                      BranchId:BranchId,
                      FollowUpDate:FollowUpDate,
                      Status: 3,
                      AreaID:AreaID
                    })
                      .then(() => {
                        return res.status(200).json({
                          errMsg: false,
                          response: "Registration Successfull.",
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        return res.status(400).json({
                          errMsg: false,
                          response: "Registration failed",
                          err,
                        });
                      });
                  } else {
                    return res.status(400).json({
                      errMsg: true,
                      response: "Already  Registered Lead",
                    });
                  }
                });
              } else {
                console.log(result.length);
                return res
                  .status(400)
                  .json({ errMsg: true, response: "Already  Registered User" });
              }
            })
            .catch((err) => {
              res
                .status(400)
                .json({ errMsg: true, response: "query error." + err });
            });
        })
        .catch((err) => {
          return res.status(500).json({ errMsg: true, response: err });
        });
      return AgentRegRes;
    } catch (error) {
      console.log("try catch error", error);
    }
  }
}
module.exports = new LaedRegService();
