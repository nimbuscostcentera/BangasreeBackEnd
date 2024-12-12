const express=require("express");
const {getAllAgent}=require("../Services/Agent");
const AgentList=()=>{
 try {
   const ListAg = getAllAgent;
   return ListAg;
 } catch (error) {
   throw error;
 }
}
module.exports={
    AgentList
}