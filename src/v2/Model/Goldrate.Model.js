const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
const { PurityMasters } = require("./PurityMaster.Model");
// console.log(Pwd);
const date = new Date();
const Goldrates = sq.define("goldrates", {
  ID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ID_PURITY: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "puritymasters",
      key: "ID",
    },
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "companycode",
    },
  },
  GOLD_RATE: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  CURRDATE: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

Goldrates.belongsTo(PurityMasters, { foreignKey: "ID_PURITY" });
PurityMasters.hasMany(Goldrates, { foreignKey: "ID_PURITY" });

// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });

module.exports = { Goldrates };
