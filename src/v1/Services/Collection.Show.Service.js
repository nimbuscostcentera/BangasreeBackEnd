const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
class CollectionViewService {
  // Function to calculate the amount to be paid
  calculateAmountToBePaid(item) {
    const startDate = new Date(item.StartDate);
    const endDate = new Date();
    let amttobepaid = 0;

    switch (item.frequency) {
      case "Daily":
        const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        amttobepaid = item.EMI * Math.max(diffDays, 1);
        break;
      case "Monthly":
        const monthDiff = (endDate.getMonth() - startDate.getMonth()) + 1;
        amttobepaid = item.EMI * Math.max(monthDiff, 1);
        break;
      case "Yearly":
        const yearDiff = endDate.getFullYear() - startDate.getFullYear() + 1;
        amttobepaid = item.EMI * Math.max(yearDiff, 1);
        break;
      default:
        amttobepaid = item.EMI;
        break;
    }

    return amttobepaid;
  }

  // CustomerCollectionShow method
  async CustomerCollectionShow(req, res, next) {
    try {
      console.log(req.body, "in show service");
      const { CompanyCode, MaturityStatus, BonusStatus, AgentCode, TimeToMature, CustomerID, Due, CollDate, SchemeRegId, LoggerBranchId, SuperUserType } = req.body;
      const date = new Date();
      const repobj = {};

      let sql = `
SELECT 
  sr.ID AS SchemeRegId,
  sr.CustomerAccNo,
  cm.CustomerName,
  sm.SchemeTitle,
  SUM(et.CollectedAmt) AS totcolection,
  MAX(et.CollDate) AS lastDate,
  sr.SUUid,
  sr.StartDate,
  sr.EMI,
  sr.frequency,
  cm.AgentCode,
  et.PaymentMode,
  et.PaymentStatus,
  et.ChqNO,
  et.ChqDate,
  et.MICR,
  et.TransactionId,
  et.ReceiptNo,
  sr.MaturityStatus,
  sr.BonusStatus,
  sr.BonusComment,
  sr.MaturityComment,
  sr.RedeemAmt,
  CASE 
    WHEN mc.CustomerAccNo IS NOT NULL THEN 'Certificate Generated' 
    ELSE 'No Certificate' 
  END AS CertificateStatus
FROM schemeregisters AS sr
INNER JOIN customermasters AS cm ON sr.UUid = cm.UUid
INNER JOIN usermasters AS um ON um.UUid = cm.UUid
INNER JOIN schememasters AS sm ON sm.SUUid = sr.SUUid
LEFT JOIN emitrans AS et ON et.SchemeRegId = sr.ID AND et.PaymentType = 2
LEFT JOIN maturitycertificates AS mc ON mc.CustomerAccNo = sr.CustomerAccNo
WHERE 1=1      `;

      if (MaturityStatus !== undefined && MaturityStatus !== -1 && MaturityStatus !== null) {
        sql += " AND sr.MaturityStatus = :MaturityStatus";
        repobj.MaturityStatus = MaturityStatus;
      }

      if (BonusStatus !== undefined && BonusStatus !== -1 && BonusStatus !== null) {
        sql += " AND sr.BonusStatus = :BonusStatus";
        repobj.BonusStatus = BonusStatus;
      }

      if (AgentCode) {
        sql += " AND cm.AgentCode = :AgentCode";
        repobj.AgentCode = AgentCode;
      }

      if (TimeToMature) {
        sql += " AND sr.EndDate <= :date";
        repobj.date = date;
      }

      if (CustomerID) {
        sql += " AND cm.CustomerID = :CustomerID";
        repobj.CustomerID = CustomerID;
      }

      if (CollDate) {
        sql += " AND et.CollDate = :CollDate";
        repobj.CollDate = CollDate;
      }

      if (SchemeRegId) {
        sql += " AND sr.ID = :SchemeRegId";
        repobj.SchemeRegId = SchemeRegId;
      }

      if (LoggerBranchId && LoggerBranchId !== -1 && SuperUserType !== 1) {
        sql += " AND um.BranchId = :LoggerBranchId";
        repobj.LoggerBranchId = LoggerBranchId;
      }

      sql += " GROUP BY sr.id";

      const Custsw = await sq.sync().then(async () => {
        const rst = await sq.query(sql, { replacements: repobj, type: QueryTypes.SELECT });

        if (rst.length !== 0) {
          const arr = rst.map((item) => {
            const amttobepaid = this.calculateAmountToBePaid(item); // Use 'this' to call the method
            const red = amttobepaid > item.totcolection ? 1 : 0;

            return {
              ...item,
              amttobepaid,
              red,
              totcollected: item.totcolection,
              PaybaleAmt: amttobepaid,
            };
          });

          return res.status(200).json({ errmsg: false, response: arr });
        } else {
          return res.status(200).json({
            errmsg: true,
            response: [],
            message: "No Data exists",
          });
        }
      }).catch((err) => {
        console.error(err);
        return res.status(500).json({ errmsg: true, response: err });
      });
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}

module.exports = new CollectionViewService();
