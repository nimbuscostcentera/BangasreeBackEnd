const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');
uuidv4();
const { sequelize, DataTypes, UUID, UUIDV4 } = require("sequelize");
const PassBookMaster = sq.define("passbookmaster", {
  PassBookId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  PassBookNo: {
    type: DataTypes.STRING,
   
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "CompanyCode",
    },
  },
  BranchId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
        model: "branchmasters",
        key: "BranchId",
      },
  },
  AgentId:{
    type:DataTypes.BIGINT,
    references: {
        model: "agentmasters",
        key: "AgentID",
      },
  },
  CustomerID:{
    type:DataTypes.BIGINT,
    references: {
        model: "customermasters",
        key: "CustomerID",
      },
  },
  CustomerAccNo: {
    type: DataTypes.STRING,

  },
  Status:{
    type:DataTypes.INTEGER,     ///1:assign to agent 2:assign to customer 3:not assigned
    allowNull:false
  },
  Transfer:{
    type:DataTypes.INTEGER,     
   
  },
  OrginalPBId:
  {
    type:DataTypes.BIGINT,
  },
  TransferDate:
  {
    type:DataTypes.DATEONLY
  }

});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { PassBookMaster };