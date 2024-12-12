const { sq } = require("../../DataBase/ormdb");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class CollectionSubmissonService {
  async CollectionSubmisson(req, res, next) {
    try {
      console.log(req.body, "service");
      var Custsw;
      var sql="";
      const { CollectionUUId, Utype, status } = req.body;
      if (CollectionUUId) {
        console.log("1st part");
        if(status==3 || status==4)
        {
          sql="Update emitrans set PaymentStatus=:STS where CollectionUUId in(:id)  and PaymentStatus=2"
        }
        else{
          sql="Update emitrans set PaymentStatus=:STS where CollectionUUId in(:id) "
        }
        Custsw = await sq
          .query(
            sql,
            {
              replacements: { id: CollectionUUId, STS: status },
              type: QueryTypes.UPDATE,
            }
          )
          .then(async (res2) => {
            console.log("success :", res2[1]);
            if(status==3)
            {  if ( res2[1]==0){
              return res
              .status(401)
              .json({ errmsg: true , response: "Payment Not Yet Submitted By The Agent" });

            }
            else{
              return res
              .status(200)
              .json({ errmsg: false, response: "Approved Successfully" });
            }

            }
            else if(status==4)
            {
                if ( res2[1]==0){
                return res
                .status(401)
                .json({ errmsg: true, response: "Payment Not Yet Submitted By The Agent" });
  
              }
              else
              {
                return res
                .status(200)
                .json({ errmsg: false, response: "Rejected Successfully" });
              }

            }
            else{
              return res
              .status(200)
              .json({ errmsg: false, response: "Submitted Successfully" });
            }

          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errmsg: true, response: err });
          });
      } else {
        return res
          .status(500)
          .json({ errmsg: true, response: "Unauthorized To Perform This!!!" });
      }
      return Custsw;
    } catch (error) {
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
}
module.exports = new CollectionSubmissonService();
