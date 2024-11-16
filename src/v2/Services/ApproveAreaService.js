const { sq } = require("../../DataBase/ormdb");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class ApproveAreaService {
  async ApproveArea(req, res, next) {
    try {
      console.log(req.body, "service");

      const { Status, AreaID } = req.body;
      await sq
        .query(`Update areamasters set Status=:st where AreaID in (:aid)`, {
          replacements: { st: Status, aid: AreaID },
          type: QueryTypes.UPDATE,
        })
        .then(async (rst) => {
          return res.status(200).json({
            errmsg: false,
            response: "Area Status Updated Successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ errmsg: true, response: err });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "FAILED", response: error });
    }
  }
}
module.exports = new ApproveAreaService();
