const { sq } = require("../../DataBase/ormdb");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class CustomerEditService {
  async CustomerEdit(req, res, next) {
    // let {email , AgentCode } = req.body

    try {
      console.log("in Cust edit");
      const {
        AgentCode,
        SuperUserID,
        CompanyCode,
        ExecutiveCode,
        CustomerName,
        Guardian,
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
        CustUUid,
        NomineeDOB,
        AreaID,
      } = req.body;
      console.log(req.body);
      const DBConnection = await sq
        .sync()
        .then(async () => {
          const customer = await CustomerMasters.update(
            {
              EmailId: EmailId,
              AgentCode: AgentCode,
              CompanyCode: CompanyCode,
              SuperUserID: SuperUserID,
              ExecutiveCode: ExecutiveCode,
              CustomerName: CustomerName,
              Guardian: Guardian,
              Address: Address,
              LocalBody: LocalBody,
              LandMark: LandMark,
              GeoLocation: GeoLocation,
              PhoneNumber: PhoneNumber,
              AlternateNo: AlternateNo,
              DOB: DOB,
              Occupation: Occupation,
              Sex: Sex,
              IdProofType: IdProofType,
              IdProofNumber: IdProofNumber,
              AplicantPhoto: `${PhoneNumber}.jpg`,
              IdProofPhoto: `${PhoneNumber}.jpg`,
              Customersignature: `${PhoneNumber}.jpg`,
              Nomineename: Nomineename,
              Relation: Relation,
              NomineeIdProofType: NomineeIdProofType,
              NomineeIdProofNumber: NomineeIdProofNumber,
              NomineeIdProofPhoto: NomineeIdProofPhoto,
              NomineePhoto: NomineePhoto,
              Nomineesignature: Nomineesignature,
              Status: Status,
              NomineeDOB: NomineeDOB,
              AreaID: AreaID,
            },
            {
              where: {
                UUid: CustUUid,
              },
            }
          )
            .then(async (resp) => {
              console.log(resp, "123");
              const customer = await UserMasters.update(
                {
                  BranchId: BranchId,
                  UserName: CustomerName,
                  Email: EmailId,
                },
                {
                  where: {
                    UUid: CustUUid,
                  },
                }
              )
                .then(async (rst) => {
                  return res
                    .status(200)
                    .json({ errmsg: false, response: "Updated Successfully" });
                })
                .catch((err) => {
                  return res
                    .status(400)
                    .json({ errmsg: true, response: "Update Failed" + err });
                });
            })
            .catch((err) => {
              return res
                .status(400)
                .json({ errmsg: true, response: "Update Failed" + err });
            });
        })
        .catch((err) => {
          console.log(err);
        });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: error });
    }
  }
}
module.exports = new CustomerEditService();
