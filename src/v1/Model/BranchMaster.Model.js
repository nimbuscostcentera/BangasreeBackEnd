const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');
uuidv4();
const { sequelize, DataTypes, UUID, UUIDV4 } = require("sequelize");
const BranchMasters = sq.define("branchmasters", {
  BranchId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  BranchCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "CompanyCode",
    },
  },
  BranchName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AreaId: {
    type: DataTypes.BIGINT,
    allowNull: true,

  },
  Status:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  MaxSrl:
  {
    type:DataTypes.INTEGER
  }
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { BranchMasters };