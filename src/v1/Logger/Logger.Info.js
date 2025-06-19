const { sq } = require("../../DataBase/ormdb");
const { LogBookPages } = require("../Model/LogBookPage.Model");
const { LogBookList } = require("../Model/LogBookList.Model");
const log4js = require("log4js");
const moment=require("moment")
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
log4js.configure({
  appenders: {
    console: { type: "console" },
    file: { type: "file", filename: `logs/log_${getCurrentDate()}.log` },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "info" },
  },
});
class LoggerInfo {
  Logreq(req, res, next) {
    // const userId = req.headers['user-id'];
    const userId = req.body.LoggerID;
    const logger = log4js.getLogger();
    console.log("black in men",req.url);
    // Get IP address of the user
    const ipAddress = req.ip;
    var body = {};
    body = req.body;
    logger.info(
      `Received API request: ${req.method} ${
        req.url
      } by user  (${userId}) from IP address ${ipAddress}  with body ${JSON.stringify(
        req.body
      )}`
    );
    next();
  }
  async Logres(req, res, next) {
     console.log("in log response",req.url);
    const userId = req.headers["user-id"];
    const username = req.body.Phoneno;
    const logger = log4js.getLogger();
    try {
      if (res.statusCode == 200) {
        let logarray = await LogBookPages.findOne(
          {where:{
            URL : req.url
          }}
        );
  
          if (logarray.id) {
            console.log("black in men",req.url);
            await LogBookList.create({
              LogBookPageID: item?.dataValues?.ID,
              UserID: userId || req.body.LoggerID,
              DateTime:moment().format("YYYY-MM-DD HH:mm:ss"),
              Request: JSON.stringify(req.body),
              remark:req.url
            });
          }
        else{
          return;
        }
      }
    } catch(error){
      console.log(error.message,"why this colabery d");
    }

    logger.info(
      `Sending response: ${res.statusCode}. Response body: ${JSON.stringify(
        res.body
      )}`
    );
    //  res.send('Data response');
  }
}
module.exports = new LoggerInfo();
