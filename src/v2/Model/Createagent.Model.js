const express=require("express");
const {CrtAgnt}=require("../Services/AgentCreate.Services");
const AgentCreate=()=>{
 try {
   const crAgnt = CrtAgnt;
   return "agent Created";
 } catch (error) {
   throw error;
 }
}
module.exports={
    AgentCreate
}