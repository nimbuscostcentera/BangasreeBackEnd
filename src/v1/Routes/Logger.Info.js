const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const path = require('path');
const log4js = require('log4js');
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
log4js.configure({
    appenders: {
      console: { type: 'console' },
      file: { type: 'file', filename: `logs/log_${getCurrentDate()}.log` }
    },
    categories: {
      default: { appenders: ['console', 'file'], level: 'info' }
    }
  });
class LoggerInfo {
    Logreq(req, res, next){
        const userId = req.headers['user-id'];
        const username = req.body.Phoneno;
        const logger = log4js.getLogger();
      // console.log(req.body);
        // Get IP address of the user
        const ipAddress = req.ip;
        var body={}
        body=req.body
        logger.info(`Received API request: ${req.method} ${req.url} by user ${username} (${userId}) from IP address ${ipAddress}  with body ${JSON.stringify(req.body)}`);
        next();
    }
    Logres(req, res, next){
        // console.log("in log response");
        const userId = req.headers['user-id'];
        const username = req.body.Phoneno;
        const logger = log4js.getLogger();
      // console.log(res,res.details);
        // Get IP address of the user
        
  
  // Include obj1 in the existing response object
    
        logger.info(`Sending response: ${res.statusCode}. Response body: ${JSON.stringify(res.body)}`);
      //  res.send('Data response');
    }
}
  module.exports = new LoggerInfo();