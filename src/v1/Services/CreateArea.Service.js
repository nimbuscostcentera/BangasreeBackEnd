const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
// const { Branch } = require("../Model/SchemeMaster.Model");
const { AreaMasters } = require("../Model/AreaMaster.Model");

class AreaAddService {
  async CreateArea(req, res, next) {
    // let {email , AgentCode = null} = req.body
    try {
      console.log(req.body, "try start");
      var ID;
      const { AreaName, PinCode, District, state, country, CompanyCode } =
        req.body;

      const DBConnection = await sq.sync().then(async () => {
        console.log("I am in area");
        AreaMasters.create({
          AreaName: AreaName,
          CompanyCode: CompanyCode,
          Pincode: PinCode,
          District: District,
          state: state,
          country: country,
          Status: 1,
        })
          .then((RegRes) => { 
            console.log(RegRes,"create area res");
            return res.status(200).json({
              errMsg: false,
              response: "Area Created Succssfully",
            });
          })
          .catch((err) => {
            console.log(err,"error");
            return res.status(500).json({
              errMsg: false,
              response: "Area Creation failed." + err,
            });
          });
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new AreaAddService();
