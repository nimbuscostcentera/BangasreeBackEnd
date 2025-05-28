const { sq } = require("../../DataBase/ormdb");
const { UserMasters } = require("../Model/UserMaster.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { SuperUserMasters } = require("../Model/SuperUserMaster.Model");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const SecreateKey = "kl@#$^&%$@%!$#qwhepiu`ypidunsxjibsxjg63244543654654qww";
const http = require("http");
const crypto = require("crypto");
const Pwd = bcrypt.genSaltSync(10);
class LoginService {
  async getlogin(req, res, next) {
    try {
      var obj1, obj2, obj3, obj4, obj5, obj6;
      const uniqueId = req.body.uniqueId;
      // const PhoneNo= req.body.PhoneNo;
      const Pass = req.body.password;
      console.log(req.body);
      if (!uniqueId && !Pass) {
        return res
          .status(400)
          .json({ errMsg: true, response: "Input Missing!!!" });
      } else {
        const Loginsecure = await sq.sync().then(async () => {
          //  UserMasters.findOne({
          //   where: {
          //     [sq.or]: [
          //       { Email:  uniqueId },
          //       { PhoneNumber: uniqueId }
          //     ]
          //   },
          // })
          sq.query(
            "SELECT um.*,bm.BranchName FROM `usermasters` as um,branchmasters as bm WHERE bm.BranchId=um.BranchId and( um.`Email`=:uniqueId or um.`PhoneNumber`=:uniqueId)",
            { replacements: { uniqueId: uniqueId }, type: QueryTypes.SELECT }
          )
            .then(async (result) => {
              console.log(result[0]);
              if (result.length === 0) {
                console.log("invalid user");
                return res
                  .status(401)
                  .json({ errMsg: true, response: "invalid user" });
              } else {
                console.log(result[0].Password);
                const checkPassword = bcrypt.compareSync(
                  Pass,
                  result[0].Password
                );
                console.log(checkPassword);
                if (!checkPassword) {
                  return res.status(400).json({
                    errMsg: true,
                    response: "Wrong Username and Password",
                  });
                } else {
                  const a = await sq.sync().then(async () => {
                    await sq
                      .query(
                        "SELECT sm.*,d.Designation,'login sucessfully' FROM superusermasters as sm,designations as d WHERE d.Did=sm.DID and  sm.UUid=:UUid and sm.Status=1",
                        {
                          replacements: { UUid: result[0].UUid },
                          type: QueryTypes.SELECT,
                        }
                      )
                      .then(async (superuserResp) => {
                        console.log(superuserResp);
                        if (superuserResp.length !== 0) {
                          await sq.query(
                            "Update usermasters set Logout=0 where UUid=:UUid",
                            {
                              replacements: { UUid: result[0].UUid },
                              type: QueryTypes.UPDATE,
                            }
                          );
                          const accessToken = JWT.sign(
                            { suid: result[0].UUid },
                            SecreateKey,
                            {
                              expiresIn: "1h",
                            }
                          );
                          const refreshToken = JWT.sign(
                            { suid: result[0].UUid },
                            SecreateKey,
                            {
                              expiresIn: "1d",
                            }
                          );
                          console.log(superuserResp);
                          obj1 = superuserResp;
                          obj2 = {
                            Utype: result[0].Utype,
                            UserID: result[0].UserID,
                            UserName: result[0].UserName,
                            BranchId: result[0].BranchId,
                            BranchName: result[0].BranchName,
                          };
                          obj4 = { AccessToken: accessToken };
                          obj5 = { refreshToken: refreshToken };

                          obj3 = {
                            ...superuserResp[0],
                            ...obj2,
                            ...obj4,
                            ...obj5,
                          };
                          console.log(obj3, "TEST");
                          return res.status(200).json({
                            errMsg: false,
                            response: "SuperUser Successfully login",
                            details: obj3,
                          });
                        } else {
                          await AgentMasters.findAll({
                            where: {
                              UUid: result[0].UUid,
                              Status: 1,
                            },
                          })
                            .then(async (AgentResp) => {
                              if (AgentResp.length !== 0) {
                                await sq.query(
                                  "Update usermasters set Logout=0 where UUid=:UUid",
                                  {
                                    replacements: { UUid: result[0].UUid },
                                    type: QueryTypes.UPDATE,
                                  }
                                );
                                const accessToken = JWT.sign(
                                  { suid: result[0].UUid },
                                  SecreateKey,
                                  {
                                    expiresIn: "1h",
                                  }
                                );
                                const refreshToken = JWT.sign(
                                  { suid: result[0].UUid },
                                  SecreateKey,
                                  {
                                    expiresIn: "1d",
                                  }
                                );
                                obj1 = AgentResp[0].dataValues;
                                obj2 = {
                                  Utype: result[0].Utype,
                                  UserID: result[0].UserID,
                                  UserName: result[0].UserName,
                                  BranchId: result[0].BranchId,
                                  BranchName: result[0].BranchName,
                                };
                                obj4 = { AccessToken: accessToken };
                                obj5 = { refreshToken: refreshToken };
                                obj3 = { ...obj1, ...obj2, ...obj4, ...obj5 };
                                console.log(obj3, "TEST");
                                return res.status(200).json({
                                  errMsg: false,
                                  response: "Agent Successfully login",
                                  details: obj3,
                                });
                              } else {
                                await CustomerMasters.findAll({
                                  where: {
                                    UUid: result[0].UUid,
                                    Status: 1,
                                  },
                                })
                                  .then(async (CustomerResp) => {
                                    if (CustomerResp.length !== 0) {
                                      await sq.query(
                                        "Update usermasters set Logout=0 where UUid=:UUid",
                                        {
                                          replacements: {
                                            UUid: result[0].UUid,
                                          },
                                          type: QueryTypes.UPDATE,
                                        }
                                      );
                                      const accessToken = JWT.sign(
                                        { suid: result[0].UUid },
                                        SecreateKey,
                                        {
                                          expiresIn: "1h",
                                        }
                                      );
                                      const refreshToken = JWT.sign(
                                        { suid: result[0].UUid },
                                        SecreateKey,
                                        {
                                          expiresIn: "1d",
                                        }
                                      );
                                      obj1 = CustomerResp[0].dataValues;
                                      obj2 = {
                                        Utype: result[0].Utype,
                                        UserID: result[0].UserID,
                                        UserName: result[0].UserName,
                                        BranchId: result[0].BranchId,
                                        BranchName: result[0].BranchName,
                                      };
                                      obj4 = { AccessToken: accessToken };
                                      obj5 = { refreshToken: refreshToken };
                                      obj3 = {
                                        ...obj1,
                                        ...obj2,
                                        ...obj4,
                                        ...obj5,
                                      };
                                      return res.status(200).json({
                                        errMsg: false,
                                        response: "Customer Successfully login",
                                        details: obj3,
                                      });
                                    } else {
                                      return res.status(401).json({
                                        errMsg: "false",
                                        response: "No Active User",
                                      });
                                    }
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  });
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        return Loginsecure;
      }
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.response || error } });
    }
  }
  async ForgetPass(req, res, next) {
    const generateRandomPassword = (length) => {
      const Upperchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const LowerChars = "abcdefghijklmnopqrstuvwxyz";
      const numeric = "0123456789";
      const specialChar = "@$#";
      const charset = [Upperchars, LowerChars, numeric, specialChar];
      let password = "";
      const allchar = charset.join("");

      const randomUpper = crypto.randomInt(0, Upperchars.length);
      const randomLower = crypto.randomInt(0, LowerChars.length);
      const randomNumeric = crypto.randomInt(0, numeric.length);
      const randomSpecial = crypto.randomInt(0, specialChar.length);

      password =
        Upperchars[randomUpper] +
        LowerChars[randomLower] +
        numeric[randomNumeric] +
        specialChar[randomSpecial];

      for (let i = 0; i < length - charset.length; i++) {
        const randomIndex = crypto.randomInt(0, allchar.length);
        password += allchar[randomIndex];
      }
      // Split the string into an array of characters
      const chars = password.split("");

      // Sort the array using a custom comparison function
      chars.sort(() => Math.random() - 0.5);

      // Join the array back into a string
      return chars.join("");
    };
    try {
      var obj1, obj2, obj3, obj4, obj5, obj6;
      // const uniqueId = req.body.uniqueId;
      const PhoneNo = req.body.PhoneNo;
      var name;
      var password;
      console.log(req.body);
      if (!PhoneNo) {
        return res
          .status(400)
          .json({
            errMsg: true,
            response: "You Have To Enter Phone Number First!!!",
          });
      } else {
        const Loginsecure = await sq.sync().then(async () => {
          sq.query(
            "SELECT * FROM `usermasters` WHERE  `PhoneNumber`=:PhoneNo",
            { replacements: { PhoneNo: PhoneNo }, type: QueryTypes.SELECT }
          )
            .then(async (result) => {
              if (result.length === 0) {
                return res
                  .status(401)
                  .json({ errMsg: true, response: "No Such User!!!" });
              } else {
                const length = 7; // Length of the password
                name = result[0].UserName;
                password = generateRandomPassword(length);
                console.log(password);
                const hashPassword = bcrypt.hashSync(password, Pwd);
                console.log(hashPassword);
                await sq
                  .query(
                    `Update usermasters set password=:password where PhoneNumber =:PhoneNo`,
                    {
                      replacements: {
                        PhoneNo: PhoneNo,
                        password: hashPassword,
                      },
                      type: QueryTypes.UPDATE,
                    }
                  )
                  .then(async (res3) => {
                    console.log(password);
                    var url = "";
                    ////___________________________________SMS Integration_______________________________

                    url =
                      url +
                      "http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX";
                    url =
                      url +
                      "&mobile=+91" +
                      PhoneNo +
                      "&message=Hello " +
                      name +
                      ", Your password for Login ID " +
                      PhoneNo +
                      " has been reset. Your new password is " +
                      password +
                      " . Please change your password after logging in. In case you have not requested for a new password, please contact 8585023758 and report. Regards, Bangasree Jewellers&senderid=BJSWRN&accusage=1&entityid=1201170685649952029&tempid=1207171266143917568";
                    console.log(url);
                    http
                      .get(url, (response) => {
                        let data = "";

                        // A chunk of data has been received.
                        response.on("data", (chunk) => {
                          data += chunk;
                        });
                        response.on("end", () => {
                          console.log(data);
                        });
                      })
                      .on("error", (error) => {
                        console.error(`Error: ${error.message}`);
                      });
                    //__________________________________________________________________________________________________________
                    return res
                      .status(200)
                      .json({
                        errmsg: false,
                        response:
                          "Please Check Your Registred Phone Number For New PassWord!!!",
                      });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        return Loginsecure;
      }
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.response || error } });
    }
  }
  async ResetPass(req, res, next) {
    try {
      var obj1, obj2, obj3, obj4, obj5, obj6;
      // const uniqueId = req.body.uniqueId;
      const PhoneNo = req.body.PhoneNo;
      const Pass = req.body.password;
      const NewPass = req.body.Newpassword;
      console.log(req.body);
      if (!PhoneNo && !Pass) {
        return res
          .status(400)
          .json({ errMsg: true, response: "Input Missing!!!" });
      } else {
        const Loginsecure = await sq.sync().then(async () => {
          //  UserMasters.findOne({
          //   where: {
          //     [sq.or]: [
          //       { Email:  uniqueId },
          //       { PhoneNumber: uniqueId }
          //     ]
          //   },
          // })

          sq.query(
            "SELECT * FROM `usermasters` WHERE  `PhoneNumber`=:PhoneNo",
            { replacements: { PhoneNo: PhoneNo }, type: QueryTypes.SELECT }
          )
            .then(async (result) => {
              console.log(result[0]);
              if (result.length === 0) {
                console.log("invalid user");
                return res
                  .status(401)
                  .json({ errMsg: true, response: "invalid user" });
              } else {
                console.log(result[0].Password);
                const checkPassword = bcrypt.compareSync(
                  Pass,
                  result[0].Password
                );
                console.log(checkPassword);
                if (!checkPassword) {
                  return res.status(400).json({
                    errMsg: true,
                    response: "Wrong Username and Password",
                  });
                } else {
                  const hashPassword = bcrypt.hashSync(NewPass, Pwd);
                  await sq
                    .query(
                      `Update usermasters set password=:password where PhoneNumber =:PhoneNo`,
                      {
                        replacements: {
                          PhoneNo: PhoneNo,
                          password: hashPassword,
                        },
                        type: QueryTypes.UPDATE,
                      }
                    )
                    .then(async (res3) => {
                      return res
                        .status(200)
                        .json({
                          errmsg: false,
                          response: "Password Reset Successfully!!!",
                        });
                    });
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        return Loginsecure;
      }
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.response || error } });
    }
  }
  async registration(req, res, next) {
    return res.status(200).json("ok");
  }
}
module.exports = new LoginService();
