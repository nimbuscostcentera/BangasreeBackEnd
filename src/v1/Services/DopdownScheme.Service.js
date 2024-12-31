const { sq } = require("../../DataBase/ormdb");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");

class DopdownSchemeService {
  async DropDownScheme(req, res, next) {
    try {
      const { CustUUid, ID, Status } = req.body;
      var qt = {};
      var sql = `SELECT SM.SCHEMETITLE,SR.EMI,SR.frequency,SR.CustomerAccNo,SR.ID,SM.Regfees,SM.Duration,SM.BONUS,
          SR.PassBookNo, SR.Nomineename, SR.NomineeDOB, SR.Relation, SR.NomineeIdProofType,SR.NomineeIdProofNumber, 
          SR.NomineeIdProofPhoto, SR.NomineePhoto, SR.Nomineesignature,SR.NomineePhone FROM schemeregisters AS SR
          INNER JOIN schememasters AS SM ON SM.SUUid = SR.SUUid WHERE SR.MaturityStatus = 1`;

      if (ID != "" && ID != undefined && ID != null) {
        console.log(ID, "find ID");

        sql = sql + " and  SR.ID=:ID";
        qt.ID = ID;
      }

      if (CustUUid != "" && CustUUid != null && CustUUid != undefined) {
        sql = sql + " AND SR.UUID=:uuid  ";
        qt.uuid = CustUUid;
      }

      if (
        Status != "" &&
        Status != null &&
        Status != undefined &&
        Status != -1
      ) {
        sql = sql + " and SM.Status=:Status ";
        qt.Status = Status;
      }
      console.log(sql, "sql");
      var Custsw = await sq.query(sql, {
        replacements: qt,
        type: QueryTypes.SELECT,
      });

      if (Custsw.length != 0) {
        return res.status(200).json({ errmsg: false, response: Custsw });
      } else {
        return res
          .status(200)
          .json({ errmsg: true, msg: "No record Found", response: Custsw });
      }
    } catch (error) {
      console.log(error,"error");

      return res
        .status(400)
        .json({ status: "FAILED", response: error?.message });
    }
  }
}
module.exports = new DopdownSchemeService();
