const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/SchemeMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class SerachSchmService {
  async SchemeSearch(req, res, next) {
    try {
      var obj = {};
      var SchemeTitle;
      var like;
      console.log(req.query);
      if (req.query.SchemeTitle != null) {
        console.log(req.query.SchemeTitle);
        SchemeTitle = req.query.SchemeTitle;
        like = "%";
        SchemeTitle = SchemeTitle + like;
        obj.SchemeTitle = SchemeTitle;
      }
      // console.log(Object.keys(obj1).length);
      // sq.sync().then(() =>
      if (Object.keys(obj).length != 0) {
        //  console.log("1st part");
        const Agntsw = await sq
          .query(
            "select *  from schememasters  where SchemeTitle like :status ",
            { replacements: { status: SchemeTitle }, type: QueryTypes.SELECT }
          )
          .then(async (res2) => {
            console.log(res2);
            if (res2.length != 0) {
              console.log(res2);
              res.status(200).json({ errmsg: false, response: res2 });
            } else {
              console.log(res2);
              res.status(200).json({
                status: 500,
                errmsg: true,
                response: "No record Found",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
        console.log("service1 ok");
        return Agntsw;
        // const users =  AgentMasters.findAll();
      }
    } catch (error) {
      return res
        .status(error?.status || 500)
        .json({ errmsg: true, response: "Server Error" });
    }
  }
}
module.exports = new SerachSchmService();
