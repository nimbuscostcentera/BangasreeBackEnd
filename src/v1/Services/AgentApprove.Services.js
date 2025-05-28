const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const http = require("http");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Pwd = bcrypt.genSaltSync(10);
const axios = require("axios");
class ApproveAgntService {
  async AgentApprove(req, res, next) {
    const generateRandomPassword = (length) => {
      const Upperchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const LowerChars = "abcdefghijklmnopqrstuvwxyz";
      const numeric = "0123456789";
      const specialChar = "!@$";
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
      var Agntsw;
      var PhoneNumber;
      var password;
      const { Status, UUid } = req.body;
      console.log(req.body,"check01");
      if (UUid!=undefined && UUid!='' && UUid!=[] && UUid.length!=0) {
        console.log(req.body);
        const length = 6; // Length of the password
        password = generateRandomPassword(length);
        console.log(password,"pass");
        const hashPassword = bcrypt.hashSync(password, Pwd);
        console.log(hashPassword,"PWD");
        const Ph = await AgentMasters.findOne({
          attributes: ["Phonenumber","UUid"],
          where: { AgentID: UUid },
      });

      if (!Ph) {
          console.error("Customer not found ");
          // Skip to next iteration if branch not found
      }
      var uuid
      uuid=Ph.dataValues.UUid
      PhoneNumber = Ph.dataValues.Phonenumber;
        Agntsw = await sq
          .query("Update agentmasters set Status=:st,password=:hashPassword where AgentID in(:id) ", {
            replacements: { st: Status, id: UUid,hashPassword:hashPassword },
            type: QueryTypes.UPDATE,
          })
          .then(async(res2) => {
            await sq
            .query(
              `Update usermasters set password=:password where UUid in (:id)`,
              {
                replacements: {  id: uuid,password:hashPassword },
                type: QueryTypes.UPDATE,
              }
            )
            .then(async (res3) => {
            console.log("success :", res2);
            console.log("IN SMS");
            var url = '';
            url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
            url=url+'&mobile=+91'+PhoneNumber+'&message=Welcome to Bangasree Jewellers. Your agent application is approved and your portal is ready to access. Login to www.bangasreejewellers.in to check your account. Your login details are below: Login ID: '+ PhoneNumber +' Password: '+ password +' For any query, please call 8585023758 or visit your nearest branch/office. Regards, Bangasree Jewellers&senderid=BJSWRN&accusage=1&entityid=1201170685649952029&tempid=1207171083989155584'
            console.log(url,"april 29");
            http.get(url, (response) => {
              let data = '';

              // A chunk of data has been received.
              response.on('data', (chunk) => {
                data += chunk;
              });
              response.on('end', () => {
                console.log(data,"suucess sms");
              });
            }).on('error', (error) => {
              console.error(`Error: ${error.message}`);
            });
            return res
              .status(200)
              .json({ errmsg: false, response: "Update successful" });
            })
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errmsg: true, response: err });
          });
        console.log("service1 ok");
      }
      return Agntsw;
    }
    catch (error)
    {
      console.log(error);
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
  // async AgentApprove(req, res, next) {
  //   const generateRandomPassword = (length = 8) => {
  //     const Upperchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //     const LowerChars = "abcdefghijklmnopqrstuvwxyz";
  //     const numeric = "0123456789";
  //     const specialChar = "#@$";

  //     let password = [
  //       Upperchars[crypto.randomInt(0, Upperchars.length)],
  //       LowerChars[crypto.randomInt(0, LowerChars.length)],
  //       numeric[crypto.randomInt(0, numeric.length)],
  //       specialChar[crypto.randomInt(0, specialChar.length)],
  //     ].join("");

  //     const allChars = Upperchars + LowerChars + numeric + specialChar;
  //     for (let i = password.length; i < length; i++) {
  //       password += allChars[crypto.randomInt(0, allChars.length)];
  //     }

  //     return password
  //       .split("")
  //       .sort(() => Math.random() - 0.5)
  //       .join("");
  //   };

  //   try {
  //     const { Status, UUid } = req.body;

  //     if (!UUid || UUid === "" || (Array.isArray(UUid) && UUid.length === 0)) {
  //       return res
  //         .status(400)
  //         .json({ errmsg: true, response: "Invalid Agent ID" });
  //     }
  //     if (UUid?.length > 1) {
  //       return res.status(401).json({
  //         errmsg: true,
  //         response: "Approve or Inactivate Agent one by one",
  //       });
  //     }
  //     // const transaction = await sq.transaction();

  //     const password = generateRandomPassword();
  //     const hashPassword = bcrypt.hashSync(password, Pwd);

  //     const agent = await AgentMasters.findOne({
  //       attributes: ["Phonenumber", "UUid", "Name"],
  //       where: { AgentID: UUid },
  //     });

  //     if (!agent) {
  //       return res
  //         .status(404)
  //         .json({ errmsg: true, response: "Agent not found" });
  //     }

  //     const {
  //       Phonenumber: PhoneNo,
  //       UUid: agentUUid,
  //       Name: name,
  //     } = agent.dataValues;

  //     try {
  //       // Update agent status and password
  //       await sq.query(
  //         `UPDATE agentmasters SET Status = :status, password = :hashPassword 
  //          WHERE AgentID = :id`,
  //         {
  //           replacements: { status: Status, id: UUid, hashPassword },
  //           type: QueryTypes.UPDATE,
  //         }
  //       );

  //       // Update user password
  //       await sq.query(
  //         `UPDATE usermasters SET password = :password 
  //          WHERE UUid = :id`,
  //         {
  //           replacements: { id: agentUUid, password: hashPassword },
  //           type: QueryTypes.UPDATE,
  //         }
  //       );

  //       let msg =
  //         Status !== 1
  //           ? "Agent InActivated successfully."
  //           : "Agent approved successfully.";
  //       const message =
  //         `Hello ${name}, Your agent application for Bangasree Jewellers has been approved. ` +
  //         `Your login details are: Login ID: ${PhoneNo} Password: ${password}. ` +
  //         `Please login at www.bangasreejewellers.in and change your password. ` +
  //         `For queries, call 8585023758. Regards, Bangasree Jewellers`;

  //       let url = `http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX&mobile=+91${PhoneNo}&message=${encodeURIComponent(
  //         message
  //       )}&senderid=BJSWRN&accusage=1&entityid=1201170685649952029&tempid=1207171266143917568`;

  //       if (Status == 1) {
  //         http
  //           .get(url, (response) => {
  //             let data = "";
  //             // A chunk of data has been received.
  //             response.on("data", (chunk) => {
  //               data += chunk;
  //             });
  //             response.on("end", () => {
  //               console.log(data);
  //             });
  //           })
  //           .on("error", (error) => {
  //             console.error(`Error: ${error.message}`);
  //           });
  //       }

  //       // await transaction.commit();
  //       return res.status(200).json({ errmsg: false, response: msg, url: url });
  //     }
  //     catch (error) {
  //       // await transaction.rollback();
  //       console.error("Approval process failed:", error);
  //       return res.status(500).json({
  //         errmsg: true,
  //         response: "Agent approval failed",
  //         response: error.message,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Server error:", error);
  //     return res
  //       .status(500)
  //       .json({ status: "FAILED", response: error.message });
  //   }
  // }
}
module.exports = new ApproveAgntService();
