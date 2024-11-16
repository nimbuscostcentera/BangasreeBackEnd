const { sq } = require("../../DataBase/ormdb");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { QueryTypes } = require("sequelize");
class PagePermissionShowByUser {
  async ShowUserPermission(req, res, next) {
    try {
      var PermissionShow;
      console.log(req.body);
      const { CompanyCode, Utype, UUid } = req.body;
      if (
        CompanyCode != "" &&
        CompanyCode != null &&
        CompanyCode != undefined &&
        Utype != "" &&
        Utype != null &&
        Utype != undefined &&
        UUid != "" &&
        UUid != null &&
        UUid != undefined
      ) {
        PermissionShow = await sq.sync().then(async () => {
          UserPermissions.findAll({
            where: {
              CompanyCode: CompanyCode,
              UserUUid: UUid,
            },
          })
            .then(async (resp) => {
              if (resp.length === 0) {
                respPerUser = await sq
                  .query(
                    "SELECT pm.PageId, COALESCE(ud.Utype,:Utype) AS usertype, COALESCE(ud.CompanyCode,:CompanyCode) AS CompanyCode, COALESCE(ud.View,0)as ViewPage,COALESCE(ud.Add,0) AS 'Create', COALESCE(ud.Del,0) AS 'Delete', COALESCE(ud.Edit,0) AS 'Edit' FROM pagemasters pm LEFT JOIN userdefaults ud ON pm.PageId = ud.PageId AND ud.Utype = :Utype AND ud.CompanyCode=:CompanyCode;",
                    {
                      replacements: { Utype: Utype, CompanyCode: CompanyCode },
                      type: QueryTypes.SELECT,
                    }
                  )
                  .then(async (resp2) => {
                    console.log(resp2);
                    return res
                      .status(200)
                      .json({ errmsg: false, response: resp2 });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
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
      return PermissionShow;
    } catch (err) {
      console.log("out try block");
      return res.status(500).json({ status: "FAILED", response: err });
    }
  }
}
module.exports = new PagePermissionShowByUser();
