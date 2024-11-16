const { sq } = require("../../DataBase/ormdb");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { QueryTypes } = require("sequelize");
class FindPageId {
  async FindPageId(req, res, next) {
    try {
      var Page;
      const { PageName } = req.body;
      if (PageName != "" && PageName != null && PageName != undefined) {
        Page = await sq.sync().then(async () => {
          PageMasters.findAll({
            where: {
              PageName: PageName,
            },
          })
            .then(async (resp) => {
              if (resp.length === 0) {
              } else {
                console.log("in Try after query");
                return res.status(200).json({ errmsg: false, response: resp });
              }
            })
            .catch((err) => {
              return res.status(500).json({ status: "FAILED", response: err });
            });
        });
      }
      return Page;
    } catch (err) {
      console.log("out try block");
      return res.status(500).json({ status: "FAILED", response: err });
    }
  }
}
module.exports = new FindPageId();
