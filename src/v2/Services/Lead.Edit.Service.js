const { sq } = require("../../DataBase/ormdb");
const { ProabableCustomers } = require("../Model/ProabableCustomer.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class LeadEditService {
  async EditLead(req, res, next) {
    // let {email , AgentCode } = req.body
    try {
      const {
        AgentCode,
        SuperUserID,
        CompanyCode,
        ExecutiveCode,
        CustomerName,
        Gurdian,
        Address,
        LocalBody,
        LandMark,
        GeoLocation,
        PhoneNumber,
        AlternateNo,
        EmailId,
        DOB,
        Occupation,
        CustomerAccNo,
        Sex,
        IdProofType,
        IdProofNumber,
        IdProofPhoto,
        AplicantPhoto,
        Customersignature,
        Nomineename,
        Relation,
        NomineeIdProofType,
        NomineeIdProofNumber,
        NomineeIdProofPhoto,
        NomineePhoto,
        Nomineesignature,
        Status,
        UUid,
        CustomerID,
        BranchId,
        FollowUpDate,
        AreaID
      } = req.body;

      const DBConnection = await sq
        .sync()
        .then(async () => {
          const customer = await ProabableCustomers.update(
            {
              EmailId: EmailId,
              AgentCode: AgentCode,
              CompanyCode: CompanyCode,
              SuperUserID: SuperUserID,
              ExecutiveCode: ExecutiveCode,
              CustomerName: CustomerName,
              Gurdian: Gurdian,
              Address: Address,
              LocalBody: LocalBody,
              LandMark: LandMark,
              GeoLocation: GeoLocation,
              PhoneNumber: PhoneNumber,
              AlternateNo: AlternateNo,
              DOB: DOB,
              Occupation: Occupation,
              CustomerAccNo: CustomerAccNo,
              Sex: Sex,
              IdProofType: IdProofType,
              IdProofNumber: IdProofNumber,
              IdProofPhoto: IdProofPhoto,
              AplicantPhoto: AplicantPhoto,
              Customersignature: Customersignature,
              Nomineename: Nomineename,
              Relation: Relation,
              NomineeIdProofType: NomineeIdProofType,
              NomineeIdProofNumber: NomineeIdProofNumber,
              NomineeIdProofPhoto: NomineeIdProofPhoto,
              NomineePhoto: NomineePhoto,
              Nomineesignature: Nomineesignature,
              Status: Status,
              BranchId:BranchId,
              FollowUpDate:FollowUpDate,
              AreaID:AreaID
            },
            {
              where: {
                CustomerID: CustomerID,
              },
            }
          )
            .then(async (resp) => {
              return res
                .status(200)
                .json({ errmsg: false, response: "Updated Successfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new LeadEditService(); 
