const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
// const { CustomerPayments } = require("../Model/AgentCollection.Model");
const { EmiTrans } = require("../Model/AgentCollection.Model");
const { v4: uuidv4 } = require("uuid");
class CustomerCollectionService {
  async CustomerCollection(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      var CollDate = new Date();
      const {
        UUid,
        CustUUid,
        SchemeregisterId,
        CollectedAmt,
        PaymentMode,
        SUUid,
      } = req.body;
      console.log(req.body);
      const Colluuid = uuidv4();
      const DBConnection = await sq.sync().then(async () => {
        // SchemeRegisters.findAll
        SchemeRegisters.findAll({
          where: {
            ID: SchemeregisterId,
            UUid: CustUUid,
          },
        })
          .then(async (Result) => {
            if (Result.length != 0) {
              console.log("I am in if");
              await EmiTrans.create({
                CollectionUUId: Colluuid,
                AgentUUid: UUid,
                CustomerUUid: CustUUid,
                SUUid: SUUid,
                CollDate: CollDate,
                CollectedAmt: CollectedAmt,
                PaymentMode: PaymentMode,
                PaymentType: 2,
                PaymentStatus: 1,
              })
                .then(async (resultCust) => {
                  console.log(resultCust, "I am in Emitrans then");
                  return res.status(200).json({
                    errMsg: false,
                    response: "Payment Entry Succssfull.",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({ errmsg: true, response: err });
                });
            } else {
              return res.status(200).json({
                status: 500,
                errmsg: true,
                response: "No Such Schemes For This Customer",
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({ errMsg: true, response: err });
          });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new CustomerCollectionService();
