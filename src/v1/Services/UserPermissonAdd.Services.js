const { sq } = require("../../DataBase/ormdb");
const { UserMasters } = require("../Model/UserMaster.Model");
const { UserPermissions } = require("../Model/UserPermission.Model");
const { UserDefault } = require("../Model/UserDefault.Model");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { response } = require("express");
class UserPermissonAdd {
  async UserPermissonAdd(req, res, next) {
    try
    {
      console.log(req.body?.UUid, "Start");
      const {Utype,CompanyCode,UUid,data} = req.body;
      var objreq = data;
      var i = 0;
      var flag =0;
      var length1 = objreq.length;
      //  console.log(objreq);
      var  usersw = await sq.sync().then(async () => {
        UserMasters.findAll({
          where: {
            CompanyCode: CompanyCode,
          },
        }).then(async (res1) => {
          if (res1.length != 0)
          {
            for (i = 0; i < length1; i++)
            {
              var newobj = objreq[i];
              console.log(newobj, "req list");
              await UserPermissions.findAll({
                where: {
                  UUid: UUid,
                  PageId: newobj?.PageId,
                },
              }).then(async (res3) => {
                console.log(newobj?.PageId,"new");
                console.log(res3.length);

                console.log(res3,i)
                if (res3.length == 0) {
                  console.log("ho",)
                  // console.log(newobj?.ViewPage, newobj?.PageId,newobj?.usertype);
                  //  UserPermissions.create({
                  //   UUid: UUid,
                  //   PageId: newobj?.PageId,
                  //   Utype: Utype,
                  //   CompanyCode: CompanyCode,
                  //   View: newobj?.ViewPage,
                  //   Add: newobj?.Create,
                  //   Edit: newobj?.Edit,
                  //   Del: newobj?.Delete,
                  //   Default: newobj?.Default,
                  // })
                  // console.log(newobj?.ViewPage,"test");
                  // if(newobj?.Create==undefined)
                  // {
                  //   newobj?.Create=0
                  // }
                  // if(newobj?.Edit==undefined)
                  // {
                  //   newobj?.Edit=0
                  // }
                  // if(newobj?.Delete==undefined)
                  // {
                  //   newobj?.Delete=0
                  // }
                  // if(newobj?.ViewPage==undefined)
                  // {
                  //   newobj?.ViewPage=0
                  // }
                  await sq
                    .query(
                      "INSERT INTO `userpermissions`(`CompanyCode`, `Utype`, `UUid`, `PageId`, `View`, `Add`, `Edit`, `Del`) VALUES (:CompanyCode, :Utype, :UUid, :PageId, :View, :Add, :Edit, :Del)",
                      {
                        replacements: {
                          Utype: Utype,
                          CompanyCode: CompanyCode,
                          UUid: UUid,
                          PageId: newobj?.PageId,
                          View: newobj?.ViewPage||0,
                          Add: newobj?.Create||0,
                          Edit: newobj?.Edit||0,
                          Del: newobj?.Delete||0,
                         
                        },
                        type: QueryTypes.INSERT,
                      }
                    )
                    .then(async (RegRes1) => {
                      console.log(RegRes1, "res in sql er then");
                      await sq.query("Update usermasters set Logout=1 where UUid=:UUid",{ replacements:{UUid:UUid},type:QueryTypes.UPDATE})
                    })
                    .catch((err) => {
                      console.log(err);
                      flag = 1;
                     
                    });
                } else if (res3.length != 0) {
                  console.log("hi");
                  UserPermissions.update(
                    {
                      View: newobj?.ViewPage,
                      Add: newobj?.Create,
                      Edit: newobj?.Edit,
                      Del: newobj?.Delete,
                      UUid: UUid,
                      PageId: newobj?.PageId,
                      Utype: Utype,
                      Default: newobj?.Default,
                    }, // Set the field and its new value
                    {
                      where: {
                        UUid:UUid,
                        PageId: newobj?.PageId,
                      },
                    }
                  ).then(async(RegRes1) => {
                    console.log(RegRes1,"hello");
                    await sq.query("Update usermasters set Logout=1 where UUid=:UUid",{ replacements:{UUid:UUid},type:QueryTypes.UPDATE})
                   
                    })
                    .catch((err) => {
                      console.log(err);
                      flag = 1;
                    });
                }
              });
            }  
            // console.log(flag);
            if (flag === 1) {
              console.log(" not ok permission")
              return res.status(500).json({errmsg:true,response:"Permission Assigned Failed"})
            }
            else {
              console.log("ok permission");
               return res.status(200).json({ errmsg: false ,response:"Permission Updated successfully"});
            }
          }
          else
          {
            return res.status(200).json({
              status: 500,
              errmsg: true,
              response: "UnAuthorized Request!!",
            });
          }
        });
      });
      return usersw;
    }
    catch (error)
    {
    //  console.log(error)
    }
  }
}
module.exports = new UserPermissonAdd();
