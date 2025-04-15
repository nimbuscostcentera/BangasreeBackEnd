const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { SuperUserMasters } = require("../Model/SuperUserMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { PageMasters } = require("../Model/PageMaster.Model");
const JWT = require("jsonwebtoken");
const { response } = require("express");
const SecreateKey = "kl@#$^&%$@%!$#qwhepiu`ypidunsxjibsxjg63244543654654qww";
class Permission {
  checkPermissionMiddleware = async (req, res, next) => {
    console.log(req.url, req.headers, "pe4rmis");
    try {
      var validate = 0;
      var uuid = req.body.LoggerUUid;
      var CompanyCode = req.body.CompanyCode;
      var requrl = req.url;
      UserMasters.findAll({
        where: {
          CompanyCode: CompanyCode,
          UUid: uuid,
        },
      }).then((Result) => {
        if (Result.length != 0) {
          sq.query(
            "select up.* from  `userpermissions` as up,`pagemasters` as pm where pm.PageId=up.PageId and ((pm.addurl=:requrl and up.Add=1) or (pm.Viewurl=:requrl and 	up.View=1)or(pm.EditUrl=:requrl and 	up.Edit=1)or(pm.DelUrl=:requrl and 	up.Del=1)) and up.UUid=:uuid ",
            {
              replacements: {
                uuid: uuid,
                requrl: requrl,
              },
              type: QueryTypes.SELECT,
            }
          ).then((Rst) => {
            if (Rst.length != 0) {
              next();
              console.log(validate);
            } else {
              console.log("trrd");
              res.status(403).json({ Response: "Permission Denied" });
            }
          });
        } else {
          console.log("trrd");
          res.status(403).json({ Response: "Permission Denied" });
        }
        if (validate == 1) {
          // If permission is granted, call the next middleware or controller
        } else {
          // If permission is denied, send an error response
        }
      });
      console.log("after check!!", validate);
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }

    // UserMasters.findAll({
    //   where: {
    //     CompanyCode: CompanyCode,
    //     UUid :UseruuID,
    //   },
    // })
    // Check for permission logic
    // if (/* your permission logic here */) {
    //   // If permission is granted, call the next middleware or controller
    //   next();
    // } else {
    //   // If permission is denied, send an error response
    //   res.status(403).json({ error: 'Permission denied' });
    // }
  };
  verifyToken(req, res, next) {
    const RefreshToken = req.header("RefreshToken");
    const AccessToken = req.header("Authorization");
    console.log(AccessToken, RefreshToken, "my access");
    if (!AccessToken) {
      //console.log("no");
      return res.status(400).json({ response: " AccessToken is missing" });
    } else {
      // console.log("hello");
      try {
        const decoded = JWT.verify(AccessToken.split(" ")[1], SecreateKey);
        req.uuid = decoded.uuid;
        console.log(decoded, req.body, "piku");

        UserMasters.findOne({
          attributes: ["LogOut"],
          where: { UUid: req.body.LoggerUUid || req.body.UUid },
        })
          .then((res15) => {
            console.log(
              res15?.dataValues?.LogOut,
              "i am in permission check then"
            );
            let logout = res15?.dataValues?.LogOut;
            if (logout == 1) {
              return res.status(402).json({ response: "Permisson Changed" });
            } else {
              if (req.url == "/verify-token") {
                console.log("yes", req.url);
                return res.status(200).json({ response: "verified" });
              } else {
                console.log("no", req.url);
                next();
              }
            }
          })
          .catch((err) => {
            console.log(err, "i am in permission check catch");
          });
      } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
          // Token has expired
          return res.status(401).json({ response: "Access Token has expired" });
        } else {
          // Other token verification errors
          return res.status(401).json({ response: "Invalid Access Token" });
        }
      }
    }
  }
  GenerateToken(req, res, next) {
    console.log("refresh", req);
    console.log("ghhhh", req.header("Authorization"));
    const RefreshToken = req.header("Authorization");
    //const AccessToken = req.header("AccessToken");
    //console.log(req.header("Authorization"), "test");
    if (!RefreshToken) {
      res.status(400).json({ response: "Refresh Token is missing" });
    } else {
      try {
        var obj1;
        // Verify the refresh token using the secret key
        const decoded = JWT.verify(RefreshToken.split(" ")[1], SecreateKey);
        // Extract UUID from the decoded refresh token
        var uuid = decoded.uuid;
        //console.log(userId);
        // Generate a new access token with a short expiration time
        const accessToken = JWT.sign({ uuid: uuid }, SecreateKey, {
          expiresIn: "1h",
        });
        // Send the new access token in the response
        obj1 = { AccessToken: accessToken };
        console.log(obj1, "hello moto");
        return res.status(200).json({
          errMsg: false,
          response: obj1,
        });
      } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
          // Token has expired
          return res
            .status(402)
            .json({ response: "Refresh Token has expired" });
        } else {
          // Other token verification errors
          return res.status(402).json({ response: "Invalid Access Token" });
        }
      }
    }
  }
}
module.exports = new Permission();
