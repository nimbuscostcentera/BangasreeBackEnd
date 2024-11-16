const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');
uuidv4();
const { sequelize, DataTypes, UUID, UUIDV4 } = require("sequelize");
const CompanyMasters = sq.define("companymasters", {
  CompanyCode: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull:false
  },
  UUID:{
    type:DataTypes.STRING,
    unique:true,
    allowNull:false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING,
    
  },
  ContactNumber: {
    type: DataTypes.STRING,
   
  },
  GSTIN: {
    type: DataTypes.STRING,
  },
  PANNo: {
    type: DataTypes.STRING,
  },
  Country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Status: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
