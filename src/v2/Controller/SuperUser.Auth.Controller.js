const express=require("express");
const { SuperUserList } = require("../Model/SuperUser.Model");
const ListofSuperUser=(req,res)=>{
try{
 const SUList = SuperUserList(); 
res.status(200).send(SUList);
}
catch(error){
 res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
}
}
module.exports = {
  ListofSuperUser,
};