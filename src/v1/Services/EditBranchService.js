const { sq } = require("../../DataBase/ormdb");
const { BranchMasters } = require("../Model/BranchMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class EditBranchService {
  async EditBranch(req, res, next) {
    // let {email , AgentCode } = req.body

    try {
      console.log("in Cust edit");
      var ID;
      const { BranchCode, BranchName, Status, BranchId } = req.body;
      if (
        req.body.AreaID != "" &&
        req.body.AreaID != null &&
        req.body.AreaID != "undefined"
      ) {
        ID = req.body.AreaID;
      }
      console.log(ID,"Area");
      BranchMasters.update(
        {
          BranchCode: BranchCode,
          BranchName: BranchName,
          AreaId: ID,
          Status: Status,
        },
        {
          where: {
            BranchId: BranchId,
          },
        }
      )
        .then(async (resp) => {
          console.log(resp,"testbranchedit");
          return res
            .status(200)
            .json({ errmsg: false, response: "Updated Successfully" });
        })
        .catch((err) => {
          console.log(err,"error");
          return res
            .status(400)
            .json({ errmsg: true, response: "Update Failed" + err });
        });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: error });
    }
  }
}
module.exports = new EditBranchService();
