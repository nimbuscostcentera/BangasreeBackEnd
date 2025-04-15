const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class SerachAgntService {
  async AgentSearch(req, res, next) {
    try {
      var obj = {};
      var name;
      var like;
      if (req.query.Name != null) {
        console.log(req.query.Name);
        name = req.query.Name;
        like = "%";
        name = name + like;
        obj.name = name;
      }
      // console.log(Object.keys(obj1).length);
      // sq.sync().then(() =>
      if (Object.keys(obj).length != 0) {
        // console.log("1st part");
        const Agntsw = await sq
          .query(
            "select Name,AgentID from agentmasters  where name like :status ",
            { replacements: { status: name }, type: QueryTypes.SELECT }
          )
          .then(async (res2) => {
            if (res2.length != 0) {
              console.log(res2);
              res.status(200).json({ errmsg: false, response: res2 });
            } else {
              res
                .status(200)
                .json({
                  status: 500,
                  errmsg: true,
                  response: "No record Found",
                });
            }
          });
        console.log("service1 ok");

        // const users =  AgentMasters.findAll();
      }
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ status: "FAILED", data: { error: error?.message || error } });
    }
  }
}
module.exports = new SerachAgntService();
