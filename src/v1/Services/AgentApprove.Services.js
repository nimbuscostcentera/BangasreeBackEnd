const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const http = require('http');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const Pwd = bcrypt.genSaltSync(10);
class ApproveAgntService {
  async AgentApprove(req, res, next) {
    // function generateRandomPassword(length) {
    //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?';
    //   let password = '';
    
    //   for (let i = 0; i < length; i++) {
    //     const randomIndex = crypto.randomInt(0, chars.length);
    //     password += chars[randomIndex];
    //   }
    
    //   return password;
    // }

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
            console.log(url);
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
}
module.exports = new ApproveAgntService();
