const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { NotificationHeaders } = require("../Model/NotificationHeader.Model");
const { NotificationDetails } = require("../Model/NotificationDetails.Model");
const { UserMasters } = require("../Model/UserMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class NotificationSendService {
  async NotificationSend(req, res, next) {
    console.log(req.body, "in check");
    try {
      var date = new Date();
      var AgentCode;
      var tktid;
      var reciver = {};
      var flagsent = 0;
      // console.log(date);
      var TicketId = "";
      var senderid = "";
      var senderName = "";
      // var reciversid="";
      if (
        req.body.TicketId != "" &&
        req.body.TicketId != null &&
        req.body.TicketId != "undefined"
      ) {
        TicketId = req.body.TicketId;
      }
      const { rid } = req.body;
      const CompanyCode = req.body.CompanyCode || null;
      senderid = req.body.senderid;
      senderName = req.body.senderName;
      var reciversid = req.body.reciversid;
      //var objreq = data;
      //const close=req.body.close||null;
      const Message = req.body.Message;
      const Subject = req.body.Subject;
      var i = 0;
      var flag = 0;
      var length1 = 0;
      console.log(req.body);
      if (TicketId == "") {
        length1 = rid.length;
        await NotificationHeaders.create({
          CompanyCode: CompanyCode,
          Subject: Subject,
          Close: 0,
        }).then(async (RegRes1) => {
            tktid = RegRes1.dataValues.TicketId;
            console.log(tktid, RegRes1, "tk");
            for (i = 0; i < length1; i++) 
            {
              var newobj = rid[i];
              await NotificationDetails.create({
                TicketId: tktid,
                CompanyCode: CompanyCode,
                Subject: Subject,
                ToUser: rid[i],
                FromUser: senderid,
                FromUserName: senderName,
                Message: Message,
                seen: 0,
              }).then(async (RegRes2) => {
                  flagsent = 1;
                  console.log(RegRes2);
                })
                .catch((err) => {
                  console.log(err);
                  flagsent = 0;
                  return res.status(400).json({
                    errMsg: false,
                    response: "Notification Send failed ",
                    err,
                  });
                });
              if (flagsent == 0) 
              {
                break;
              }
            }
            if (flagsent == 1) 
            {
              return res
                .status(200)
                .json({ errmsg: false, response: "Sent Successfully" });
            }
          }).catch((err) => {
            console.log(err);
            return res.status(400).json({
              errMsg: false,
              response: "Notification Send failed " + err,
              err,
            });
          });
      }
      else {
        await NotificationHeaders.findAll({
          where: {
            TicketId: TicketId,
            Close: 1,
          },
        }).then(async (rst) => {
          if (rst.length == 0) {
            await NotificationDetails.create({
              TicketId: TicketId,
              CompanyCode: CompanyCode,
              Subject: Subject,
              ToUser: reciversid,
              FromUser: senderid,
              FromUserName: senderName,
              Message: Message,
              seen: 0,
            })
              .then(async (RegRes2) => {
                console.log(RegRes2);
                return res.status(200).json({
                  errMsg: false,
                  response: "Notification Sent Succssfully.",
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json({
                  errMsg: false,
                  response: "Notification Send failed " + err,
                  err,
                });
              });
          } else {
            return res.status(200).json({
              errMsg: false,
              response: "This Ticket Is Alreday Closed",
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new NotificationSendService();
