const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { SuperUserMasters } = require("../Model/SuperUserMaster.Model");

class BackOfficeServices {
  async StatusUpdate(req, res, next) {
    try {
      const { CompanyCode, UUid, Utype, UserID, SelectedID, Status } = req.body;
      var DbStatus = await sq
        .query(
          `Update superUserMasters set Status=:st where SuperUserID in (:id)`,
          {
            replacements: { st: Status, id: SelectedID },
            type: QueryTypes.UPDATE,
          }
        )
        .then(async (res2) => {
          return res
            .status(200)
            .json({ errmsg: false, response: "Update successful" });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ errmsg: true, response: err });
        });
      return DbStatus;
    } catch (err) {
      return res.status(500).json({ errmsg: true, response: err });
    }
  }
}
module.exports = new BackOfficeServices();
