const express=require("express");
const {getAllSuperUser}=require("../Services/SuperUser");
const SuperUserList=()=>{
 try {
   const ListSU = getAllSuperUser;
   return ListSU;
 } catch (error) {
   throw error;
 }
}
module.exports={
    SuperUserList
}