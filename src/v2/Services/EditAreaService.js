const { sq } = require("../../DataBase/ormdb");
const { AreaMasters } = require("../Model/AreaMaster.Model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
class EditAreaService {
  async EditArea(req, res, next) {
    // let {email , AgentCode } = req.body
    try {
      console.log(req.body, "in Cust edit");
      var ID;
      const { AreaName, PinCode, District, state, country, Status, AreaID } =
        req.body;
      const a = sq
        .sync()
        .then(async (res1) => {
          await AreaMasters.update(
            {
              AreaName: AreaName,
              Pincode: PinCode,
              District: District,
              state: state,
              country: country,
              Status: Status,
            },
            {
              where: {
                AreaID: AreaID,
              },
            }
          )
            .then(async (resp) => {
              console.log(resp, "in then");
              if (resp[0] === 0) {
                return res
                  .status(400)
                  .json({ errmsg: false, response: "no data change" });
              } else {
                return res
                  .status(200)
                  .json({ errmsg: false, response: "Updated Successfully" });
              }
            })
            .catch((err) => {
              console.log(err, "in error");
              return res
                .status(400)
                .json({ errmsg: true, response: "Update Failed" + err });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: error });
    }
  }
}
module.exports = new EditAreaService();
