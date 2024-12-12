const { sq } = require("../../DataBase/ormdb");
const { ProabableCustomers } = require("../Model/ProabableCustomer.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ShowLeadService {
  async LeadShow(req, res, next) {
    try {
      var obj = {};
      var sql = "SELECT pc.CustomerID,pc.EmailId,pc.PhoneNumber,pc.CustomerName,pc.Address ,pc.FollowUpDate,pc.SuperUserID,pc.AgentCode,pc.BranchId,pc.Sex,bm.BranchCode,bm.BranchName,arm.AreaName,am.Name as Name,arm.AreaId ,bm.BranchCode,bm.BranchName FROM proabablecustomers as pc inner join  branchmasters as bm  on pc.BranchId=bm.BranchId inner join agentmasters as am on pc.AgentCode=am.AgentCode inner join areamasters as arm on arm.AreaID=pc.AreaId";
      var qt = {};
      console.log(req.body, "all");
      var startDate,
        endDate,
        startDateObj,
        endDateObj,
        AgentCode,
        CustomerName,
        LeadID,
        PhoneNumber;
      var time = "23:59:59";
      console.log(req.body);
      const { CompanyCode, UUid } = req.body;
      if (
        req.body.AgentCode != null &&
        req.body.AgentCode != "" &&
        req.body.AgentCode != undefined
      ) {
        AgentCode = req.body.AgentCode;
        obj.AgentCode = AgentCode;
        sql= sql + " and pc.AgentCode =:AgentCode"
      }
      if (
        req.body.PhoneNumber != null &&
        req.body.PhoneNumber != "" &&
        req.body.PhoneNumber != undefined
      ) {
        PhoneNumber = req.body.PhoneNumber;
        obj.PhoneNumber = PhoneNumber;
      }
      if (
        req.body.LoggerBranchId != "" &&
        req.body.LoggerBranchId != null &&
        req.body.LoggerBranchId != -1 &&
        req.body.LoggerBranchId != undefined &&
        req.body.SuperUserType !== 1
      ) {
        console.log(req.body.LoggerBranchId, req.body.SuperUserType,"in if");
        sql = sql + " and bm.BranchId=:bid ";
        obj.bid = req.body.LoggerBranchId;
      }
      if (
        req.body.CustomerName != null &&
        req.body.CustomerName != "" &&
        req.body.CustomerName != undefined
      ) {
        CustomerName = req.body.CustomerName;
        obj.CustomerName = CustomerName;
      }
      if (
        req.body.startDate != null &&
        req.body.startDate != "" &&
        req.body.endDate != null &&
        req.body.endDate != ""
      ) {
        startDate = req.body.startDate;
        endDate = req.body.endDate;
        console.log("Sd:", startDate, "\n", "Ed:", endDate);
        startDateObj = `${startDate} ${time}`;
        endDateObj = new Date(`${endDate} ${time}`);
        console.log("Sd1:", startDateObj, "\n", "Ed1:", endDateObj);
        sql=sql+" and pc.createdAt between :sd and :ed "
        qt.sd = startDateObj;
        qt.ed = endDateObj;
        obj.createdAt = { [Op.between]: [startDateObj, endDateObj] };
        console.log(obj, endDateObj, startDateObj, "service1 ok");
      }
      if (
        req.body.LeadId != null &&
        req.body.LeadId != "" &&
        req.body.LeadId != undefined
      ) {
        LeadID = req.body.LeadId;
        obj.CustomerID = LeadID;
        sql= sql + " and pc.CustomerID =:CustomerID"
        qt.CustomerID = LeadID;
       
      }

console.log(AgentCode);
        await sq
          .query(sql, { replacements: obj, type:QueryTypes.SELECT })
          .then(async (res2) => {
            // console.log(rse2,"customer data");
            if (res2.length != 0) {
              console.log(res2);
              res.status(200).json({ errmsg: false, response: res2 });
            } else {
              res
                .status(200)
                .json({ errmsg: true, msg: "No record Found", response: [] });
            }
          })
          .catch((err) => {
            console.log(err);
          });
        // const users =  AgentMasters.findAll();
     
  
    } catch (error) {
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
}
module.exports = new ShowLeadService();
