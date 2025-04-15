const { sq } = require("../../DataBase/ormdb");
const { PassBookMaster } = require("../Model/PassBookMaster.Model");
const { CustomerMasters } = require("../Model/CustomerMaster.Model");
const { AgentMasters } = require("../Model/AgentMaster.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
class PassBookAssignService {
  async AssignPassBookToAgent(req, res, next) {
    try {
      var Agntsw;
      var id;
      console.log(req.body,"PBno");
      const { AgentID, data } = req.body;
      var len;
      len = data.length
      console.log(len);
      var i;
      const passbookCreationPromises = [];
      //const PassBookIDs = JSON.parse(req.body.PassBookID.replace(/'/g, '"'));
      // console.log(PassBookID);
      if (len != 0) {
        // console.log(PassBookID, "after parse");
        AgentMasters.findAll({
          where:
          {
            AgentID:AgentID,
            Status:1
          }
        })
        .then(async (userid) => {
        for (i = 0; i < len; i++) {
          console.log(data[i], "single");
          passbookCreationPromises.push(
            await sq.query(
              `Update passbookmasters set AgentID=:AgentID,Status=1 where PassBookID in (:id) `,
              {
                replacements: {
                  AgentID: AgentID,
                  id: data[i].PassBookId,
                  
                },
                type: QueryTypes.UPDATE,
              }
            )
          );
        }
           await Promise.all(passbookCreationPromises)
             .then(async (finalrst) => {
               return res.status(200).json({
                 errMsg: false,
                 response: "Passbooks Assigned Successfully",
               });
             })
             .catch((err) => {
               console.log(err);
               return res.status(500).json({
                 errMsg: true,
                 response: "Passbooks Genertaion  failed" + err,
                 err,
               });
             });
          
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                errMsg: true,
                response: "Not Active Agent" ,
                err,
              });
            });  

        console.log("service1 ok");
      }
    } catch (error) {
      console.log(error,"catch");
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }

  async AssignPassBookToCustomer(req, res, next) {
    try {
      var Agntsw;
      console.log(req.body,"test");
      const { CustUUid, PassBookID, CustomerAccNo, data } = req.body;
         var len;
         len = data.length;
         console.log(len);
         var i;
         const passbookCreationPromises = [];
      // console.log(req.body);
      CustomerMasters.findAll({
        where: {
          UUid: CustUUid,
        },
      })
        .then(async (userid) => {
          console.log(userid[0].dataValues.CustomerID, "id");
          for (i = 0; i < len; i++) {
            console.log(data[i].PassBookNo,"test1");
              if (data[i].PassBookNo != '')
              {
              await sq.query(
                "Update passbookmasters set CustomerID=:CustomerID,CustomerAccNo=:CustomerAccNo,Status=2 where PassBookNo in(:id) ",
                {
                  replacements: {
                    CustomerID: userid[0].dataValues.CustomerID,
                    CustomerAccNo: data[i].CustomerAccNo,
                    id: data[i].PassBookNo,
                   
                  },
                  type: QueryTypes.UPDATE,
                }
              )
              .then(async(rst) => {
                passbookCreationPromises.push(
                  await sq.query(
                    "Update schemeregisters set PassBookNo=:id where ID=:schemeid  ",
                    {
                      replacements: {
                        schemeid: data[i].SchemeRegId,
                        id: data[i].PassBookNo,
                      },
                      type: QueryTypes.UPDATE,
                    }
                  )
                  );
              })
              
            }
            else{
              return res.status(400).json({
                errMsg: false,
                response: "Enter PassBook No First!!",
              })

            }

          }
          console.log(passbookCreationPromises,"rst");
          await Promise.all(passbookCreationPromises)
            .then((res2) => {
              console.log("success :", res2.length);
                if(res2.length !=0 )
                {
                  return res.status(200).json({
                    errmsg: false,
                    response: "Passbooks Assigned to customer successfully",
                  });
                
                }
                else
                {
                  return res.status(401).json({
                    
                    response: "First Choose A Passbook No !!",
                  });
                                  
                }


            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ errmsg: true, response: err });
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ errmsg: true, response: err });
        });
        console.log("service1 ok");
      
      return Agntsw;
    } catch (error) {
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
  async ReturnPassBookToAgent(req, res, next) {
    try {
      var Agntsw;
      var id;
      console.log(req.body,"PBno");
      const { AgentID, data } = req.body;
      var len;
      len = data.length
      console.log(len);
      var i;
      const passbookCreationPromises = [];
      //const PassBookIDs = JSON.parse(req.body.PassBookID.replace(/'/g, '"'));
      // console.log(PassBookID);
      if (len != 0) {
        // console.log(PassBookID, "after parse");
        AgentMasters.findAll({
          where:
          {
            AgentID:AgentID,
            Status:1
          }
        })
        .then(async (userid) => {
        for (i = 0; i < len; i++) {
          console.log(data[i], "single");
          passbookCreationPromises.push(
            await sq.query(
              `Update passbookmasters set AgentID=null,Status=3 where PassBookID in (:id) `,
              {
                replacements: {
                  id: data[i].PassBookId,
                  
                },
                type: QueryTypes.UPDATE,
              }
            )
          );
        }
           await Promise.all(passbookCreationPromises)
             .then(async (finalrst) => {
               return res.status(200).json({
                 errMsg: false,
                 response: "Passbooks Returned Successfully",
               });
             })
             .catch((err) => {
               console.log(err);
               return res.status(500).json({
                 errMsg: true,
                 response: "Passbooks Return  failed" + err,
                 err,
               });
             });
          
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                errMsg: true,
                response: "Not Active Agent" ,
                err,
              });
            });  

        console.log("service1 ok");
      }
    } catch (error) {
      console.log(error,"catch");
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
  async ReturnPassBookToAgent(req, res, next) {
    try {
      var Agntsw;
      var id;
      console.log(req.body,"PBno");
      const { AgentID, data } = req.body;
      var len;
      len = data.length
      console.log(len);
      var i;
      const passbookCreationPromises = [];
      //const PassBookIDs = JSON.parse(req.body.PassBookID.replace(/'/g, '"'));
      // console.log(PassBookID);
      if (len != 0) {
        // console.log(PassBookID, "after parse");
        AgentMasters.findAll({
          where:
          {
            AgentID:AgentID,
            Status:1
          }
        })
        .then(async (userid) => {
        for (i = 0; i < len; i++) {
          console.log(data[i], "single");
          passbookCreationPromises.push(
            await sq.query(
              `Update passbookmasters set AgentID=null,Status=3 where PassBookID in (:id) `,
              {
                replacements: {
                  id: data[i].PassBookId,
                  
                },
                type: QueryTypes.UPDATE,
              }
            )
          );
        }
           await Promise.all(passbookCreationPromises)
             .then(async (finalrst) => {
               return res.status(200).json({
                 errMsg: false,
                 response: "Passbooks Returned Successfully",
               });
             })
             .catch((err) => {
               console.log(err);
               return res.status(500).json({
                 errMsg: true,
                 response: "Passbooks Return  failed" + err,
                 err,
               });
             });
          
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                errMsg: true,
                response: "Not Active Agent" ,
                err,
              });
            });  

        console.log("service1 ok");
      }
    } catch (error) {
      console.log(error,"catch");
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
  async ReturnPassBookToCustomer(req, res, next) {
    try {
      var Agntsw;
      var id;
      console.log(req.body,"PBno");
      const {  CustomerAccNo,PassBookNo ,ID} = req.body;
      var len;
      // len = data.length
      // console.log(len);
      var i;
      const passbookCreationPromises = [];
      //const PassBookIDs = JSON.parse(req.body.PassBookID.replace(/'/g, '"'));
      // console.log(PassBookID);

        // console.log(PassBookID, "after parse");
        await sq.query(
          `Update schemeregisters set PassBookNo=null where CustomerAccNo =:CustomerAccNo `,
          {
            replacements: {
              CustomerAccNo: CustomerAccNo,
            },
            type: QueryTypes.UPDATE,
          }
        )
        .then(async (res2) => {
          passbookCreationPromises.push(
            await sq.query(
              `Update passbookmasters set CustomerID=null,CustomerAccNo=null,Status=1 where PassBookNo in (:PassBookNo) `,
              {
                replacements: {
                  PassBookNo: PassBookNo,
                  
                },
                type: QueryTypes.UPDATE,
              }
            )
          );
            })
           await Promise.all(passbookCreationPromises)
             .then(async (finalrst) => {
               return res.status(200).json({
                 errMsg: false,
                 response: "Passbooks Returned Successfully",
               });
             })
             .catch((err) => {
               console.log(err);
               return res.status(500).json({
                 errMsg: true,
                 response: "Passbooks Return  failed" + err,
                 err,
               });
             });



    } catch (error) {
      console.log(error,"catch");
      return res.status(500).json({ status: "FAILED", data: error });
    }
  }
}
module.exports = new PassBookAssignService();
