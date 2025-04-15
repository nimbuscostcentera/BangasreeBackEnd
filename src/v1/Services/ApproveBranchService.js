const { sq } = require("../../DataBase/ormdb");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const {
  schemeregisterhistory,
} = require("../Model/SchemeRegisterHistory.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ApproveBranchService {
  async ApproveBranch(req, res, next) {
    try {
      console.log(req.body, "service");

      const { Status, SelectedID } = req.body;
      // if (CustomerID?.length!=0) {
      //   val = "CustomerID";
      //   value = CustomerID;
      // }
      // else if (UUid?.length != 0) {
      //   val = "UUid";
      //   value = UUid;
      // }

      await sq
        .query(
          `Update branchmasters set Status=:st where BranchId   in (:BranchId)`,
          {
            replacements: { st: Status, BranchId: SelectedID },
            type: QueryTypes.UPDATE,
          }
        )
        .then(async (rst) => {
          return res.status(200).json({
            errmsg: false,
            response: "Branch Status Updated Successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ errmsg: true, response: err });
        });
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
}
module.exports = new ApproveBranchService();
