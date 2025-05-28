// const { sq } = require("../../DataBase/ormdb");
// const { AreaMasters } = require("../Model/AreaMaster.Model");
// const { Op } = require("sequelize");
// const { QueryTypes } = require("sequelize");
// class SerachLocation {
//   async LocationSearch(req, res, next) {
//     try {

//       // console.log(Object.keys(obj1).length);
//       // sq.sync().then(() =>

//         // console.log("1st part");
//         const Locsw = await sq
//           .query(
//             "select AreaName from AreaMasters ",
//             { type: QueryTypes.SELECT }
//           )
//           .then(async (res2) => {
//             if (res2.length != 0) {
//               console.log(res2);
//               res.status(200).json({ errmsg: false, response: res2 });
//             } else {
//               res.status(200).json({ status: 500, errmsg: true, response: "No record Found" });
//             }
//           });
//         console.log("service1 ok");

//         // const users =  AgentMasters.findAll();

//     } catch (error) {
//       return res
//         .status(error?.status || 500)
//         .json({ status: "FAILED", data: { error: error?.message || error } });
//     }
//   }
// }
// module.exports = new SerachLocation();
