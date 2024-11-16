const { sq } = require("../../DataBase/ormdb");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { schemeregisterhistory } = require("../Model/SchemeRegisterHistory.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class BonusStatusService{
 
  async BonusStatus(req, res, next) {
    try {
      console.log(req.body,"service");
      var Custsw;
      var val = "";
      var value = [];
      const { Status, CustomerID, UUid,SchemeRegId,Comment,LoggerID,CompanyCode } = req.body;
      // if (CustomerID?.length!=0) {
      //   val = "CustomerID";
      //   value = CustomerID;
      // }
      // else if (UUid?.length != 0) {
      //   val = "UUid";
      //   value = UUid;
      // }
      var sql="";
      var qt;
      if(Status==0){
        sql=`Update schemeregisters set BonusStatus=:st,BonusComment=:cmnt where ID  in (:SchemeRegId) and   MaturityStatus not in (3,2) `
        qt= {
          replacements: { st: Status,cmnt: Comment ,SchemeRegId: SchemeRegId },
          type: QueryTypes.UPDATE,
        }
      }
      else
      {
        sql=`Update schemeregisters set BonusStatus=:st where ID  in (:SchemeRegId)  and MaturityStatus not in (3,2) `
        qt= {
          replacements: { st: Status ,SchemeRegId: SchemeRegId },
          type: QueryTypes.UPDATE,
        }
      }
          Custsw = await sq
            .query(
              sql,qt
            )
            .then(async (res2) => {
              if(res2[1]=== 0)
              {
                console.log("not updated");
                return res
                .status(501)
                .json({  response: "Alreday Matured .You Can Not Change Bonus Status!!" });
              }
              else
              {

              
                await schemeregisterhistory
                  .create({
                    SchemeRegId: SchemeRegId,
                    CompanyCode: CompanyCode,
                    Status: Status,
                    Comment: Comment,
                    LoggerId: LoggerID,
                    Type: "BonusStatus",
                  })
                  .then(async (rst) => {
                    return res
                      .status(200)
                      .json({
                        errmsg: false,
                        response: "Bonus Status Updated Successfully",
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ errmsg: true, response: err });
                  });
                }    
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ errmsg: true, response: err });
            });
            
      return Custsw;
    } 
    catch (error) 
    {
      return res.status(500).json({ status: "FAILED", response: error  });
    }
  }
}
module.exports = new BonusStatusService();
