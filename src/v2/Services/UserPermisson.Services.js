const { sq } = require("../../DataBase/ormdb");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { QueryTypes } = require("sequelize");
class UserPermissonService {
  async UserPermisson(req, res, next) {
    try {
      var PermissionShow;
      console.log(req.body,"permisson");
      const { CompanyCode, Utype, LoggerUUid,UUid } = req.body;
      if (
        CompanyCode != "" &&
        CompanyCode != null &&
        CompanyCode != undefined &&
        Utype != "" &&
        Utype != null &&
        Utype != undefined &&
        LoggerUUid != "" &&
        LoggerUUid != null &&
        LoggerUUid != undefined
      ) {
        PermissionShow = await sq.sync().then(async () => {
          UserMasters.findAll({
            where: {
              CompanyCode: CompanyCode,
            },
          }).then((Result) => {
            if (Result.length != 0) {
              UserPermissions.findAll({
                where: {
                  CompanyCode: CompanyCode,
                  UUid: UUid||LoggerUUid,
                },
              })
                .then(async (resp) => {
                 
                  if (resp.length === 0) {
                    console.log("1");
                    respPerUser = await sq
                      .query(
                        "SELECT pm.PageId,pm.PageName, COALESCE(ud.Utype,:Utype) AS usertype, COALESCE(ud.CompanyCode,:CompanyCode) AS CompanyCode FROM pagemasters pm LEFT JOIN userdefaults ud ON pm.PageId = ud.PageId AND ud.Utype = :Utype AND ud.CompanyCode=:CompanyCode WHERE pm.Priority IS NOT NULL order by pm.Priority ",
                        {
                          replacements: {
                            Utype: Utype,
                            CompanyCode: CompanyCode,
                          },
                          type: QueryTypes.SELECT,
                        }
                      )
                      .then(async (resp2) => {
                      console.log(resp2,"rest");
                        return res
                          .status(200)
                          .json({ errmsg: false, response: resp2 });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    console.log("2");
                    respPerUser = await sq
                      .query(
                        "SELECT pm.PageId,pm.PageName, COALESCE(up.UUid,:UUid) AS userid,up.Utype AS usertype, COALESCE(up.CompanyCode,:CompanyCode) AS CompanyCode, COALESCE(up.View,0)as ViewPage,COALESCE(up.Add,0) AS 'Create', COALESCE(up.Del,0) AS 'Delete', COALESCE(up.Edit,0) AS 'Edit' FROM pagemasters pm LEFT JOIN userpermissions up ON pm.PageId = up.PageId AND up.UUid = :UUid AND up.CompanyCode=:CompanyCode WHERE pm.Priority IS NOT NULL order by pm.Priority",
                        {
                          replacements: {
                            UUid: UUid||LoggerUUid,
                            CompanyCode: CompanyCode,
                          },
                          type: QueryTypes.SELECT,
                        }
                      )
                      .then(async (resp2) => {
                        console.log(resp2,"rest");
                        return res
                          .status(200)
                          .json({ errmsg: false, response: resp2 });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                })
                .catch((err) => {
                  // return res
                  //   .status(500)
                  //   .json({ status: "FAILED", response: err });
                });
            } else {
              return res
                .status(200)
                .json({
                  status: 500,
                  errmsg: true,
                  response: "UnAuthorized Request!!",
                });
            }
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
module.exports = new UserPermissonService();
