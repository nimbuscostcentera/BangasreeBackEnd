const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
// console.log(Pwd);
const date = new Date();
const PurityMasters = sq.define("puritymasters", {
   ID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  PURITY: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "companycode",
    },
  },
  DESCRIPTION: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });



module.exports = { PurityMasters };
