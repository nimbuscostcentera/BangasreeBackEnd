const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');

const { sequelize, DataTypes } = require("sequelize");
const CustomerBlockHistory = sq.define("customerblockhistory", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  custid:{
    type:DataTypes.BIGINT,
    allowNull:false,
    references:
    {
    model:'customermasters',
      key: "CustomerID"
    }
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references:
    {
    model:'companymasters',
      key: "CompanyCode"
    }
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StatusComment: {
    type: DataTypes.STRING,
  },
  LoggerId:{
    type:DataTypes.BIGINT,
    allowNull:false,
    references:
    {
    model:'usermasters',
      key: "UserID"
    }
  },
  Type:{
    type:DataTypes.STRING,
    allowNull:false,
  }
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { CustomerBlockHistory };
// const d1 = designations.create({
//   UUid: uuidv4(),
//   CompanyCode: "BGPL",
//   Designation: "Backoffice User",
//   Status: true
// }
// )