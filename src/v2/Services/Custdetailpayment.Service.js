const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { MonthlyTrans } = require("../Model/MonthlyTrans.Model");
const { Op } = require("sequelize");
const moment = require("moment");
class Custdetailpayment {
  // async CustomerPaymentShow(req, res, next) {
  //   try {
  //     // Destructure with defaults
  //     const {
  //       Due = null,
  //       startDate = null,
  //       endDate = null,
  //       AgentCode = null,
  //       CustomerID = null,
  //       PaymentStatus = null,
  //       CollectionId = null,
  //       SchemeRegId = null,
  //       CompanyCode = null,
  //       PaymentType = null,
  //       LotId = null,
  //       page = 1,
  //       pageSize = 100,
  //       NotAgentPayment = -1,
  //       SearchKey = "",
  //     } = req.body;

  //     // Validate pagination parameters
  //     const validatedPage = Math.max(1, parseInt(page));
  //     const validatedPageSize = Math.min(100, Math.max(1, parseInt(pageSize)));

  //     // Calculate offset for pagination
  //     const offset = (validatedPage - 1) * validatedPageSize;

  //     // Base query with proper joins (using JOIN syntax instead of WHERE joins)
  //     let baseQuery = `
  //           SELECT
  //               et.PaymentType,
  //               et.CollectionId,
  //               et.CustomerUUid,
  //               et.CollectionUUId,
  //               cm.CustomerName,
  //               cm.UUid as CustUUid,
  //               sm.SchemeTitle,
  //               sm.Duration,
  //               sm.Regfees,
  //               sm.createdAt as SchemeStartDate,
  //               sr.frequency,
  //               et.CollectedAmt as totcolection,
  //               et.CollDate,
  //               sr.SUUid,
  //               sr.StartDate,
  //               sr.EMI,
  //               am.AgentCode,
  //               am.Commision as Commission,
  //               et.PaymentMode,
  //               et.PaymentStatus,
  //               sr.ID,
  //               et.MICR,
  //               et.TransactionId,
  //               sr.MaturityStatus,
  //               sr.BonusStatus,
  //               sr.CustomerAccNo,
  //               et.NotAgentPayment,
  //               Area.AreaName,
  //               Bm.BranchName,
  //               et.gold_rate,
  //               cm.Address,
  //               cm.PhoneNumber,
  //               COUNT(*) OVER() as total_count
  //           FROM emitrans et
  //           INNER JOIN schemeregisters sr ON et.SchemeRegId = sr.id AND et.CustomerUUid = sr.UUid
  //           INNER JOIN customermasters cm ON sr.UUid = cm.UUid
  //           INNER JOIN schememasters sm ON sr.SUUid = sm.SUUid
  //           INNER JOIN agentmasters am ON et.AgentUUid = am.UUid
  //           INNER JOIN usermasters um ON et.CustomerUUid = um.UUid
  //           INNER JOIN areamasters Area ON et.AreaID = Area.AreaID
  //           INNER JOIN branchmasters Bm ON um.BranchId = Bm.BranchId
  //           WHERE 1=1
  //       `;

  //     const queryParams = {};

  //     // Date range filter
  //     if (startDate && endDate) {
  //       baseQuery += ` AND et.CollDate BETWEEN :startDate AND :endDate`;
  //       queryParams.startDate = `${startDate} 00:00:00`;
  //       queryParams.endDate = `${endDate} 23:59:59`;
  //     }

  //     // Other filters
  //     if (AgentCode) {
  //       baseQuery += ` AND cm.AgentCode = :AgentCode`;
  //       queryParams.AgentCode = AgentCode;
  //     }

  //     if (PaymentType) {
  //       baseQuery += ` AND et.PaymentType = :PaymentType`;
  //       queryParams.PaymentType = PaymentType;
  //     }

  //     if (CustomerID) {
  //       baseQuery += ` AND cm.CustomerID = :CustomerID`;
  //       queryParams.CustomerID = CustomerID;
  //     }

  //     if (
  //       PaymentStatus !== -1 &&
  //       PaymentStatus !== null &&
  //       PaymentStatus !== undefined &&
  //       PaymentStatus !== ""
  //     ) {
  //       baseQuery += ` AND et.paymentstatus = :paymentstatus`;
  //       queryParams.paymentstatus = PaymentStatus;
  //     }

  //     if (CollectionId) {
  //       baseQuery += ` AND et.CollectionId = :CollectionId`;
  //       queryParams.CollectionId = CollectionId;
  //     }

  //     if (LotId) {
  //       baseQuery += ` AND et.LotId = :LotId`;
  //       queryParams.LotId = LotId;
  //     }

  //     if (NotAgentPayment === 0 || NotAgentPayment === 1) {
  //       baseQuery +=
  //         NotAgentPayment === 1
  //           ? ` AND et.NotAgentPayment IS NOT NULL`
  //           : ` AND et.NotAgentPayment IS NULL`;
  //     }

  //     if (SchemeRegId) {
  //       baseQuery += ` AND sr.Id = :SchemeRegId`;
  //       queryParams.SchemeRegId = SchemeRegId;
  //     }

  //     // Branch filter for non-super users
  //     if (req.body.LoggerBranchId && req.body.SuperUserType !== 1) {
  //       baseQuery += ` AND um.BranchId = :branchId`;
  //       queryParams.branchId = req.body.LoggerBranchId;
  //     }

  //     if (SearchKey !== "") {
  //       baseQuery += ` AND (cm.CustomerName LIKE :SearchKey
  //        OR  cm.PhoneNumber LIKE :SearchKey
  //        OR  Bm.BranchName LIKE :SearchKey
  //        OR  Area.AreaName LIKE :SearchKey
  //        OR  sr.CustomerAccNo LIKE :SearchKey
  //        OR  sm.SchemeTitle LIKE :SearchKey
  //        OR  cm.AgentCode LIKE :SearchKey
  //        )`;
  //       queryParams.SearchKey = `%${SearchKey}%`;
  //     }
  //     // Add pagination and ordering
  //     baseQuery += ` ORDER BY et.createdAt DESC LIMIT :limit OFFSET :offset`;
  //     queryParams.limit = validatedPageSize;
  //     queryParams.offset = offset;

  //     // Execute the query
  //     const results = await sq.query(baseQuery, {
  //       replacements: queryParams,
  //       type: QueryTypes.SELECT,
  //     });

  //     // Process results
  //     if (results.length === 0) {
  //       return res.status(200).json({
  //         success: true,
  //         response: [],
  //         pagination: {
  //           total: 0,
  //           page: validatedPage,
  //           pageSize: validatedPageSize,
  //           totalPages: 0,
  //         },
  //         message: "No data found",
  //       });
  //     }

  //     // Get total count from first row (if using window function)
  //     const totalCount = results[0]?.total_count || 0;

  //     // Process each result
  //     const processedResults = results.map((item) => {
  //       const isPaymentType2 = item.PaymentType === 2;
  //       const expectedCollection = isPaymentType2 ? item.EMI : item.Regfees;

  //       const commission = isPaymentType2
  //         ? Math.floor((item.totcolection * item.Commission) / 100)
  //         : 0;

  //       const isUnderpaid =
  //         isPaymentType2 && expectedCollection > item.totcolection;

  //       return {
  //         ...item,
  //         ExpectedCollection: expectedCollection,
  //         red: isUnderpaid ? 1 : 0,
  //         Commission: commission,
  //         // Remove the total_count if it exists
  //         ...(item.total_count && { total_count: undefined }),
  //       };
  //     });

  //     // Response with pagination info
  //     return res.status(200).json({
  //       success: true,
  //       response: processedResults,
  //       pagination: {
  //         total: totalCount,
  //         page: validatedPage,
  //         pageSize: validatedPageSize,
  //         totalPages: Math.ceil(totalCount / validatedPageSize),
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error in CustomerPaymentShow:", error);
  //     return res.status(500).json({
  //       response: [],
  //       success: false,
  //       message: "Internal server error",
  //       error:
  //         process.env.NODE_ENV === "development" ? error.message : undefined,
  //     });
  //   }
  // }
  async CustomerPaymentShow(req, res, next) {
    try {
      // Destructure with defaults
      const {
        Due = null,
        startDate = null,
        endDate = null,
        AgentCode = null,
        CustomerID = null,
        PaymentStatus = null,
        CollectionId = null,
        SchemeRegId = null,
        CompanyCode = null,
        PaymentType = null,
        LotId = null,
        NotAgentPayment = -1,
      } = req.body;

      // Base query with proper joins
      let baseQuery = `
            SELECT 
                et.PaymentType,
                et.CollectionId,
                et.CustomerUUid,
                et.CollectionUUId,
                cm.CustomerName,
                cm.UUid as CustUUid,
                sm.SchemeTitle,
                sm.Duration,
                sm.Regfees,
                sm.createdAt as SchemeStartDate,
                sr.frequency,
                et.CollectedAmt as totcolection,
                et.CollDate,
                sr.SUUid,
                sr.StartDate,
                sr.EMI,
                cm.AgentCode,
                am.Commision as Commission,
                et.PaymentMode,
                et.PaymentStatus,
                sr.ID,
                et.MICR,
                et.TransactionId,
                sr.MaturityStatus,
                sr.BonusStatus,
                sr.CustomerAccNo,
                et.NotAgentPayment,
                Area.AreaName,
                Bm.BranchName,
                et.gold_rate,
                cm.Address,
                cm.PhoneNumber
            FROM emitrans et
            INNER JOIN schemeregisters sr ON et.SchemeRegId = sr.id AND et.CustomerUUid = sr.UUid
            INNER JOIN customermasters cm ON sr.UUid = cm.UUid
            INNER JOIN schememasters sm ON sr.SUUid = sm.SUUid
            INNER JOIN agentmasters am ON cm.AgentCode = am.AgentCode
            INNER JOIN usermasters um ON et.CustomerUUid = um.UUid
            INNER JOIN areamasters Area ON et.AreaID = Area.AreaID
            INNER JOIN branchmasters Bm ON um.BranchId = Bm.BranchId
            WHERE 1=1`;

      const queryParams = {};

      // Date range filter
      if (startDate !== undefined && startDate !== null && startDate !== "" && endDate !== undefined && endDate !== null && endDate !== "") {
        baseQuery += ` AND et.CollDate BETWEEN :startDate AND :endDate`;
        queryParams.startDate = `${startDate} 00:00:00`;
        queryParams.endDate = `${endDate} 23:59:59`;
      }

      // Other filters
      if (AgentCode !== undefined && AgentCode !== -1 && AgentCode !== null && AgentCode !== "" && AgentCode !== 0) {
        baseQuery += ` AND cm.AgentCode = :AgentCode`;
        queryParams.AgentCode = AgentCode;
      }

      if (PaymentType !== undefined && PaymentType !== null && PaymentType !== "" && PaymentType !== -1 && PaymentType !== 0) {
        baseQuery += ` AND et.PaymentType = :PaymentType`;
        queryParams.PaymentType = PaymentType;
      }

      if (CustomerID !== -1 && CustomerID !== 0 && CustomerID !== undefined && CustomerID !== null && CustomerID !== "") {
        baseQuery += ` AND cm.CustomerID = :CustomerID`;
        queryParams.CustomerID = CustomerID;
      }

      if (
        PaymentStatus !== 0 &&
        PaymentStatus !== -1 &&
        PaymentStatus !== null &&
        PaymentStatus !== undefined &&
        PaymentStatus !== ""
      ) {
        baseQuery += ` AND et.paymentstatus = :paymentstatus`;
        queryParams.paymentstatus = PaymentStatus;
      }

      if (CollectionId !== -1 &&
        CollectionId !== null &&
        CollectionId !== undefined &&
        CollectionId !== "" &&
        CollectionId !== 0) {
        baseQuery += ` AND et.CollectionId = :CollectionId`;
        queryParams.CollectionId = CollectionId;
      }

      if (LotId !== 0 &&
        LotId !== -1 &&
        LotId !== null &&
        LotId !== undefined &&
        LotId !== "") {
        baseQuery += ` AND et.LotId = :LotId`;
        queryParams.LotId = LotId;
      }

      if (NotAgentPayment == 0 || NotAgentPayment == 1) {
        baseQuery +=
          NotAgentPayment === 1
            ? ` AND et.NotAgentPayment IS NOT NULL`
            : ` AND et.NotAgentPayment IS NULL`;
      }

      if (SchemeRegId !== 0 &&
        SchemeRegId !== -1 &&
        SchemeRegId !== "" &&
        SchemeRegId !== undefined &&
        SchemeRegId !== null) {
        baseQuery += ` AND sr.Id = :SchemeRegId`;
        queryParams.SchemeRegId = SchemeRegId;
      }

      // Branch filter for non-super users
      if (req.body.LoggerBranchId !== 0 &&
        req.body.LoggerBranchId !== undefined &&
        req.body.LoggerBranchId !== null &&
        req.body.LoggerBranchId !== "" &&
        req.body.LoggerBranchId !== -1 &&
        req.body.SuperUserType !== 1) {
        baseQuery += ` AND um.BranchId = :branchId`;
        queryParams.branchId = req.body.LoggerBranchId;
      }

      // Add ordering
      baseQuery += ` ORDER BY et.createdAt DESC`;

      // Execute the query
      const results = await sq.query(baseQuery, {
        replacements: queryParams,
        type: QueryTypes.SELECT,
      });

      // Process results
      if (results?.length == 0) {
        return res.status(200).json({
          success: true,
          response: [],
          message: "No data found",
        });
      }

      // Process each result
      const processedResults = results.map((item) => {
        const isPaymentType2 = item.PaymentType == 2;
        const expectedCollection = isPaymentType2 ? item.EMI : item.Regfees;

        const commission = isPaymentType2
          ? parseFloat((item.totcolection * item.Commission) / 100).toFixed(2)
          : 0;

        const isUnderpaid =
          isPaymentType2 && expectedCollection > item.totcolection;

        return {
          ...item,
          ExpectedCollection: expectedCollection,
          red: isUnderpaid ? 1 : 0,
          Commission: commission,
        };
      });

      // Response
      return res.status(200).json({
        success: true,
        response: processedResults,
      });
    } catch (error) {
      console.error("Error in CustomerPaymentShow:", error);
      return res.status(400).json({
        response: error.message,
        success: false,
      });
    }
  }
  async MonthlyPayment(req, res, next) {
    try {
      var SchemeRegId;
      if (
        req.body.SchemeRegId !== "" &&
        req.body.SchemeRegId !== null &&
        req.body.SchemeRegId !== undefined
      ) {
        console.log("sch");
        SchemeRegId = req.body.SchemeRegId;
      }
      console.log(req.body, "Month", req.body.SchemeRegId, SchemeRegId);
      MonthlyTrans.findAll({
        where: {
          SchemeRegId: SchemeRegId,
        },
      })
        .then(async (rst) => {
          console.log(rst);
          if (rst.length !== 0) {
            return res.status(200).json({ errmsg: false, response: rst });
          } else {
            return res.status(200).json({
              errMsg: true,
              response: [],
              message: "No Data exists",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(err?.status || 500)
            .json({ status: "FAILED", data: { error: err?.message || err } });
        });
    } catch (error) {
      console.log(error);
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async WalletBalance(req, res, next) {
    try {
      var SchemeRegId;
      if (
        req.body.SchemeRegId !== "" &&
        req.body.SchemeRegId !== null &&
        req.body.SchemeRegId !== undefined
      ) {
        SchemeRegId = req.body.SchemeRegId;
      }

      sq.query(
        "SELECT SUM(WalletBalance) as Wallet FROM monthlytrans where SchemeRegId=:SchemeRegId",
        {
          replacements: { SchemeRegId: SchemeRegId },
          type: QueryTypes.SELECT,
        }
      )
        .then(async (rst) => {
          if (rst.length !== 0) {
            return res.status(200).json({ errmsg: false, response: rst });
          } else {
            return res.status(200).json({
              errMsg: true,
              response: [],
              message: "No Data exists",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(err?.status || 500)
            .json({ status: "FAILED", data: { error: err?.message || err } });
        });
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
  async TotCollection(req, res, next) {
    try {
      const {
        startDate = null,
        endDate = null,
        AgentCode = null,
        PaymentStatus = null,
        CompanyCode = null,
      } = req.body;
      let baseQuery1 = `SELECT SUM(et.CollectedAmt) as TotCollection FROM emitrans as et,agentmasters as am  where et.AgentUUid=am.UUid and 
  et.CompanyCode=:CompanyCode`;
      let baseQuery2 = `SELECT SUM(et.CollectedAmt) as TotSubmission FROM emitrans as et,agentmasters as am  where et.AgentUUid=am.UUid and 
  et.CompanyCode=:CompanyCode AND et.NotAgentPayment IS NULL`;
      const queryParams = {};
      queryParams.CompanyCode = CompanyCode;
      if (startDate && endDate) {
        baseQuery1 += ` AND et.CollDate BETWEEN :startDate AND :endDate`;
        baseQuery2 += ` AND et.CollDate BETWEEN :startDate AND :endDate`;
        queryParams.startDate = `${startDate} 00:00:00`;
        queryParams.endDate = `${endDate} 23:59:59`;
      }
      if (AgentCode) {
        baseQuery1 += ` AND am.AgentCode =:AgentCode `;
        baseQuery2 += ` AND am.AgentCode =:AgentCode `;
        queryParams.AgentCode = AgentCode;
      }

      if (PaymentStatus) {
        baseQuery1 += ` AND et.PaymentStatus =:PaymentStatus `;
        baseQuery2 += ` AND et.PaymentStatus =:PaymentStatus `;
        queryParams.PaymentStatus = PaymentStatus;
      }

      let rst1 = await sq.query(baseQuery1, {
        replacements: queryParams,
        type: QueryTypes.SELECT,
      });
      let rst2 = await sq.query(baseQuery2, {
        replacements: queryParams,
        type: QueryTypes.SELECT,
      });
      console.log(rst1, rst2, "check my data");
      let rst = [{ ...rst1[0], ...rst2[0] }];
      if (rst.length !== 0) {
        return res.status(200).json({ errmsg: false, response: rst });
      } else {
        return res.status(204).json({
          errMsg: true,
          response: [],
          message: "No Data exists",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new Custdetailpayment();
