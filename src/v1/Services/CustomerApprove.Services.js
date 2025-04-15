const { sq } = require("../../DataBase/ormdb");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { CustomerBlockHistory } = require("../Model/CustomerBlockHistory.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const http = require('http');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const Pwd = bcrypt.genSaltSync(10);
class CustomerApproveService{
 
  async CustomerApprove(req, res, next) {
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
      console.log(req.body,"service");
      var Custsw;
      var val = "";
      var password;
      var PhoneNumber;
      var value = [];
      const { Status, CustomerID, UUid,Comment,LoggerId,CompanyCode,CustUUid } = req.body;
      const length = 7; // Length of the password
      password = generateRandomPassword(length);
      console.log(password);
      const hashPassword = bcrypt.hashSync(password, Pwd);
      console.log(hashPassword);
      // if (CustomerID?.length!=0) {
      //   val = "CustomerID";
      //   value = CustomerID;
      // }
      // else if (UUid?.length != 0) {
      //   val = "UUid";
      //   value = UUid;      
      // }
        if (UUid?.length != 0) {
          if (Status==2)
          {
            Custsw = await sq
            .query(
              `Update customermasters set Status=:st,StatusComment=:StatusComment where UUid in (:id)`,
              {
                replacements: { st: Status, id: CustUUid,StatusComment:Comment },
                type: QueryTypes.UPDATE,
              }
            )
            .then(async (res2) => {
              await CustomerBlockHistory.create({
                custid:CustomerID,
                CompanyCode :CompanyCode,
                Status:Status,
                StatusComment:Comment,
                LoggerId:LoggerId,
                Type:"Block"
            })
              return res
                .status(200)
                .json({ errmsg: false, response: "Update successful" });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ errmsg: true, response: err });
            });
          }
          else{
            console.log("in else");
            const Ph = await CustomerMasters.findOne({
              attributes: ["PhoneNumber"],
              where: { UUid: UUid },
          });

          if (!Ph) {
              console.error("Customer not found ");
              // Skip to next iteration if branch not found
          }

          PhoneNumber = Ph.dataValues.PhoneNumber;
            Custsw = await sq
            .query(
              `Update customermasters set Status=:st,password=:password where UUid in (:id)`,
              {
                replacements: { st: Status, id: UUid,password:hashPassword },
                type: QueryTypes.UPDATE,
              }
            )
            .then(async (res2) => {
              await sq
            .query(
              `Update usermasters set password=:password where UUid in (:id)`,
              {
                replacements: {  id: UUid,password:hashPassword },
                type: QueryTypes.UPDATE,
              }
            )
            .then(async (res3) => {
              var url = '';
              url=url+'http://trans.pmcbulksms.com/submitsms.jsp?user=BANGASREE&key=80d40e2427XX'
              url=url+'&mobile=+91'+PhoneNumber+'&message=Welcome to Bangasree Jewellers. You have successfully registered to Sonar Kella. Subscribe to a scheme and login to www.bangasreejewellers.com to check your account details and balance. Your account details are Login ID:'+ PhoneNumber + ', Password: '+ password +'.Please change your password after your first login. For any query, please call 8585023758 or visit your nearest branch/office. Regards, Bangasree Jewellers&senderid=BJSWRN&accusage=1&entityid=1201170685649952029&tempid=1207171266749437261'
              console.log(url);
              http.get(url, (response) => {
                let data = '';
              
                // A chunk of data has been received.
                response.on('data', (chunk) => {
                  data += chunk;
                });
                response.on('end', () => {
                  console.log(data);
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
          }

        } 
      return Custsw;
    } 
    catch (error) 
    {
      console.log(error);
      return res.status(500).json({ status: "FAILED", response: error  });
    }
  }
}
module.exports = new CustomerApproveService();
