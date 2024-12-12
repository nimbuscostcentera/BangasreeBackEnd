const { sq } = require("../../DataBase/ormdb");
const { SchemeRegisters } = require("../Model/SchemeRegister.Model");
const { schemeregisterhistory } = require("../Model/SchemeRegisterHistory.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class StatusShowService{
 
  async StatusShow(req, res, next) {
    try {
      console.log(req.body,"service");
      var Custsw;
      var val = "";
      var value = [];
      const { SchemeRegId ,Type } = req.body;
      // if (CustomerID?.length!=0) {
      //   val = "CustomerID";
      //   value = CustomerID;
      // }
      // else if (UUid?.length != 0) {
      //   val = "UUid";
      //   value = UUid;
      // }

  
          Custsw = await schemeregisterhistory.findAll({
            attributes: ["Comment","LoggerId","createdAt"],
            where: {
                SchemeRegId: SchemeRegId,
                Type: Type,
            },
                })
                .then(async (rst) => {
                    if (rst.length != 0) {
                        return res.status(200).json({ errmsg: false, response: rst });
                    }
                    else
                    {
                        return res
                        .status(200)
                        .json({
                          status: 500,
                          errmsg: true,
                          response: "No record Found",
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
module.exports = new StatusShowService();
