const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');

const { sequelize, DataTypes } = require("sequelize");
const schemehistory = sq.define("schemehistory", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  SUUid: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
    references:
    {
    model:"schememasters",
      key: "SUUid"
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
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Regfees: {
    type: DataTypes.FLOAT,
  },
  LoggerUUid:{
    type:DataTypes.STRING,
    allowNull:false,
  }
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { schemehistory };
