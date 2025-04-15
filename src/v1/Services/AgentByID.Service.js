const { sq } = require("../../DataBase/ormdb");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { UserMasters } = require("../Model/UserMaster.Model")
const { QueryTypes } = require("sequelize");
class AgentByIDService {
  async getAgentByID(req, res, next) {
    try {
      var obj = {};
      var obj1 = {};
      var startDateObj;
      var endDateObj;
      var startDate;
      var endDate;
      var time1 = "23:59:59";
      var time = "00:00:00";
      console.log(req.body, "fSQHGFDG"); 
      var Agntsw = {};
      console.log(obj, obj1, "Chechk");
      console.log("2nd part");
      var qt = {};
      var sql = "";
      sql =
        sql +
        "select a.*,br.branchname,br.branchcode,ar.areaname from agentmasters as a,areamasters as ar,usermasters as u,branchmasters as br where u.uuid=a.uuid and u.branchid=br.branchid and a.areaid=ar.areaid and a.AgentID =:AgentID  ";
      if (
        (req.body.AgentID  !== '' &&
          req.body.AgentID  !== null &&
          req.body.AgentID  !== undefined) 
      ) {
         //AgentID = req.body.AgentID
        // qt.status = req.body.Status;
         qt.AgentID = req.body.AgentID; 
      }

      sql = sql + " order by a.createdAt DESC ";
     
      console.log(qt, "this is my qt");
      Agntsw = await sq
        .sync()
        .then(async () => {
          console.log("i am in agent list");
          await sq
            .query(sql, { replacements: qt, type: QueryTypes.SELECT })
            .then(async (res2) => {
             // console.log(res2);
              if (res2.length != 0) {
                return res.status(200).json({ errmsg: false, response: res2 });
              } else {
                return res
                  .status(200)
                  .json({
                    errmsg: true,
                    response: res2,
                    msg: "No Record Found",
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      return Agntsw;
    } catch (error) {
      console.log(error, "error");
      return res.status(500).json({ errMsg: true, response: err });
    }
  }
}
module.exports = new AgentByIDService();
