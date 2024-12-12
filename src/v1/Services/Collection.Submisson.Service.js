const { sq } = require("../../DataBase/ormdb");
const { Lotcollections } = require("../Model/LotCollection.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const moment = require("moment");
class CollectionSubmissonService {
  async CollectionSubmission(req, res, next) {
    try {
      const {
        ids,
        status,
        CompanyCode,
        AgentCode,
        CollDate,
        CollectedAmt,
        CollPic,
      } = req.body;
      if (!ids) {
        return res
          .status(400)
          .json({ errmsg: true, response: "Unauthorized To Perform This!!!" });
      }
      let currdate = moment().format("DD_MM_YYYY_HH_mm_ss");
      console.log(req.body, "hi");

      // Create a new lot collection and capture the generated Lotid
      const newLotCollection = await Lotcollections.create({
        CompanyCode,
        AgentCode,
        Date: CollDate,
        CollectedAmt,
        pic: CollPic, // Ensure this is correct
      });

      const generatedLotid = newLotCollection.LotId; // Assuming Lotid is the name of the auto-incremented field
      const idsArray = ids.split(",").map(Number);

      // Construct SQL statement based on status
      const sql =
        status === 3 || status === 4
          ? "UPDATE emitrans SET PaymentStatus = :STS WHERE CollectionId IN (:id) AND PaymentStatus = 2"
          : `UPDATE emitrans SET PaymentStatus = :STS, LotId = :lotid WHERE CollectionId IN (:id)`;

      // Set replacements
      const replacements = { id: idsArray, STS: status, lotid: generatedLotid };

      // Execute the update query
      const [_, affectedRows] = await sq.query(sql, {
        replacements,
        type: QueryTypes.UPDATE,
      });

      // Check for affected rows and respond accordingly
      if (affectedRows === 0) {
        return res.status(401).json({
          errmsg: true,
          response: "Payment Not Yet Submitted By The Agent",
        });
      }

      const successMessages = {
        3: "Approved Successfully",
        4: "Rejected Successfully",
        default: "Submitted Successfully",
      };

      return res.status(200).json({
        errmsg: false,
        response: successMessages[status] || successMessages.default,
      });
    } catch (error) {
      console.error(error);
      // return res.status(400).json({ status: "FAILED", response: error.message });
    }
  }
  async AgentLotList(req, res, next) {
    try {
      console.log(req.body, "in show service");
      var obj = {};
      const {
        CompanyCode = null,
        StartDate = null,
        EndDate,
        PaymentStatus = null,
        AgentCode = null,
      } = req.body;
      if (
        req.body.StartDate !== "" &&
        req.body.StartDate !== null &&
        req.body.StartDate !== undefined
      ) {
        StartDate = req.body.StartDate;
      }
      if (
        req.body.EndDate !== "" &&
        req.body.EndDate !== null &&
        req.body.StartDate !== undefined
      ) {
        EndDate = req.body.EndDate;
      }
      if (
        req.body.PaymentStatus !== "" &&
        req.body.PaymentStatus !== null &&
        req.body.PaymentStatus !== undefined
      ) {
        //console.log("hello tri");
        PaymentStatus = req.body.PaymentStatus;
      }

      if (
        req.body.AgentCode !== "" &&
        req.body.AgentCode !== null &&
        req.body.AgentCode !== undefined
      ) {
        AgentCode = req.body.AgentCode;
      }

      var sql = "";
      var repobj = { CompanyCode: CompanyCode };
      sql =
        "SELECT lt.*,am.Name as AgentName,et.PaymentStatus from lotcollections as lt inner join emitrans as et on lt.LotId=et.LotId inner join agentmasters as am on am.AgentCode=lt.AgentCode  where lt.CompanyCode=:CompanyCode";

      if (
        PaymentStatus !== "" &&
        PaymentStatus !== -1 &&
        PaymentStatus !== null &&
        PaymentStatus !== undefined
      ) {
        sql = sql + " and   et.PaymentStatus=:PaymentStatus ";
        repobj.PaymentStatus = PaymentStatus;
      }
      if (AgentCode !== "" && AgentCode !== null && AgentCode !== undefined) {
        sql = sql + " and  lt.AgentCode=:AgentCode";
        repobj.AgentCode = AgentCode;
      }
      if (
        StartDate !== "" &&
        StartDate !== null &&
        StartDate !== undefined &&
        EndDate !== "" &&
        EndDate !== null &&
        EndDate !== undefined
      ) {
        sql = sql + " and  lt.Date between :StartDate and :EndDate";
        repobj.StartDate = StartDate;
        repobj.EndDate = EndDate;
      }
      if (
        req.body.LoggerBranchId !== "" &&
        req.body.LoggerBranchId !== null &&
        req.body.LoggerBranchId !== -1 &&
        req.body.LoggerBranchId !== undefined &&
        req.body.SuperUserType !== 1
      ) {
        sql = sql + " and um.BranchId=:bid ";
        repobj.bid = req.body.LoggerBranchId;
      }
      sql = sql + " GROUP by lt.LotId";
      const Custsw = await sq
        .sync()
        .then(async () => {
          // console.log("service1 ok else ", MaturityStatus);
          sq.query(sql, { replacements: repobj, type: QueryTypes.SELECT }).then(
            async (rst) => {
              // console.log("in rst");
              //console.log("test", rst);
              var arr = [];
              if (rst.length !== 0) {
                //  console.log(arr,"check");
                return res.status(200).json({ errmsg: false, response: rst });
              } else {
                //   console.log(arr,"in else");
                return res.status(200).json({
                  errMsg: true,
                  response: arr,
                  message: "No Data exists",
                });
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({ errmsg: true, response: err });
        });

      // return Custsw;
    } catch (error) {
      return res
        .status(error?.status || 400)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async ColectionStatus(req, res, next) {
    try {
      const {
        CollectionUUId,
        Status,
        CompanyCode,
        AgentCode,
        CollDate,
        CollectedAmt,
        LotId,
      } = req.body;

      if (!LotId) {
        return res
          .status(500)
          .json({ errmsg: true, response: "Unauthorized To Perform This!!!" });
      }

      // Create a new lot collection and capture the generated Lotid

      // Construct SQL statement based on status
      const sql =
        Status === 3 || Status === 4
          ? "UPDATE emitrans SET PaymentStatus = :STS WHERE LotId = :lotid AND PaymentStatus = 2 or PaymentStatus = 4"
          : "UPDATE emitrans SET PaymentStatus = :STS  WHERE LotId = :lotid";

      // Set replacements
      const replacements = { STS: Status, lotid: LotId };

      // Execute the update query
      const [_, affectedRows] = await sq.query(sql, {
        replacements,
        type: QueryTypes.UPDATE,
      });

      // Check for affected rows and respond accordingly
      if (affectedRows === 0) {
        return res
          .status(401)
          .json({ errmsg: true, response: "Payment Not Yet Approved" });
      }

      const successMessages = {
        3: "Approved Successfully",
        4: "Rejected Successfully",
        default: "Approved Successfully",
      };

      return res.status(200).json({
        errmsg: false,
        response: successMessages[Status] || successMessages.default,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "FAILED", response: error.message });
    }
  }
}
module.exports = new CollectionSubmissonService();
