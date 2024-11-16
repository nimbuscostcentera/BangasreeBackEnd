const { sq } = require("../../DataBase/ormdb");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ApproveSuperUserService {
  async ApproveSuperuser(req, res, next) {
    try {
      var Agntsw;
      const { Status, UUid, SuperUserID } = req.body;
     
        console.log(req.body);
        Agntsw = await sq
          .query(
            "Update superusermasters set Status=:st where SuperUserID in(:SuperUserID) ",
            {
              replacements: { st: Status, SuperUserID: SuperUserID },
              type: QueryTypes.UPDATE,
            }
          )
          .then((res2) => {
            console.log("success :", res2);
            return res
              .status(200)
              .json({ errmsg: false, response: "Update successful" });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ errmsg: true, response: err });
          });
        console.log("service1 ok");
      
      return Agntsw;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
}
module.exports = new ApproveSuperUserService();
