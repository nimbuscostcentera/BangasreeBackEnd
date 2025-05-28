const { sq } = require("../../DataBase/ormdb");
const { QueryTypes } = require("sequelize");
// const { Branch } = require("../Model/SchemeMaster.Model");
const { PassBookMaster } = require("../Model/PassBookMaster.Model");
const { BranchMasters } = require("../Model/BranchMaster.Model");
// const { PageMasters } = require("../Model/PageMaster.Model"); 
const { v4: uuidv4 } = require("uuid");
class PassbookAddService {
  async CreatePassbook(req, res, next) {
    // let {email , AgentCode = null} = req.body
  
    try {
      var arr = [];
      var flag={};
      console.log(req.body, "try start");
       var ID;
      const {
        NoOfBooks,
        CompanyCode,
        BranchId 
        
      } = req.body;
      const passbookCreationPromises = [];
     var i=1;
     var srl=0;
     var error;
     var Len=0;
     var passbookno;
      const DBConnection = await sq.sync().then(async () => {
        await BranchMasters.findAll({
          attributes: ["MaxSrl","BranchCode"],
          where: {
            CompanyCode: CompanyCode,
            BranchId: BranchId,
          },
        }).then(async (res3) => {
          console.log(res3[0].dataValues.MaxSrl);
          if (res3[0].dataValues.MaxSrl==null)
          {
            
            srl='000000'
          }
          else
          {
            srl=res3[0].dataValues.MaxSrl
          }

         for(i=1;i<=NoOfBooks;i++)
         {

          srl=Number(srl)+1
          srl=srl.toString();
            while (srl.length < 6) {
              srl = '0' + srl;
            }
          passbookno='BGPL-PB-'+ res3[0].dataValues.BranchCode +'-'+srl
          console.log(passbookno);
          passbookCreationPromises.push(
          PassBookMaster.create({
            CompanyCode: CompanyCode,
            BranchId: BranchId,
            PassBookNo:passbookno,
            Status: 3
          })
          );

         }
         
         BranchMasters.update(
          {
            MaxSrl: srl,
          },
          {
            where: {
              CompanyCode: CompanyCode,
              BranchId: BranchId,
            },
          }
        )
         await Promise.all(passbookCreationPromises)
         .then(async (finalrst) => {

        return res.status(200).json({
            errMsg: false,
            response: "Passbooks Generated Successfully"
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          errMsg: true,
          response: "Passbooks Genertaion  failed"+err,
          err,
        });
      });
        //  console.log(arr[0],"out loop");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          errMsg: true,
          response: "Passbooks Genertaion  failed"+err,
          err,
        });
      }); 
          
 
      });
      return DBConnection;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errMsg: true, response: err });
    }
    
  }
   async TransferPassbook(req, res, next) {
    // let {email , AgentCode = null} = req.body
  
    try {
      var arr = [];
      var flag={};
      console.log(req.body, "try start");
       var ID;
      const {
        data,
        CompanyCode,
        BranchId 
        
      } = req.body;
      var len;
      len = data.length
      console.log(len);
      const passbookCreationPromises = [];
     var i=1;
     var srl=0;
     var error;
     var Len=0;
     var passbookno;
     var date = new Date();
      const DBConnection = await sq.sync().then(async () => {
        await BranchMasters.findAll({
          attributes: ["MaxSrl","BranchCode"],
          where: {
            CompanyCode: CompanyCode,
            BranchId: BranchId,
          },
        }).then(async (res3) => {
          console.log(res3[0].dataValues.MaxSrl);
          if (res3[0].dataValues.MaxSrl==null)
          {
            
            srl='000000'
          }
          else
          {
            srl=res3[0].dataValues.MaxSrl
          }

         for(i=0;i<=len-1;i++)
         {

          srl=Number(srl)+1
          srl=srl.toString();
            while (srl.length < 6) {
              srl = '0' + srl;
            }
          passbookno=CompanyCode +'-PB-'+ res3[0].dataValues.BranchCode +'-'+srl
          console.log(data[i],"hi i am in transfer");
          passbookCreationPromises.push(
            PassBookMaster.create({
              CompanyCode: CompanyCode,
              BranchId: BranchId,
              PassBookNo:passbookno,
              OrginalPBId:data[i].PassBookId,
              Status: 3
            })
          );
          PassBookMaster.update({
            Transfer: 1,
            TransferDate:date,
          },
          {
            where: {
              PassBookId: data[i].PassBookId,
            },
          }
          )
         }
         
         BranchMasters.update(
          {
            MaxSrl: srl,
          },
          {
            where: {
              CompanyCode: CompanyCode,
              BranchId: BranchId,
            },
          }
        )
         await Promise.all(passbookCreationPromises)
         .then(async (finalrst) => {

        return res.status(200).json({
            errMsg: false,
            response: "Passbooks Genertaed Successfully"
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          errMsg: true,
          response: "Passbooks Genertaion  failed"+err,
          err,
        });
      });
        //  console.log(arr[0],"out loop");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          errMsg: true,
          response: "Passbooks Genertaion  failed"+err,
          err,
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
module.exports = new PassbookAddService();
