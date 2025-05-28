const { sq } = require("../../DataBase/ormdb");
const { sequelize, DataTypes } = require("sequelize");
const YearMasters = sq.define("yearmasters", {
  SessionID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
});

// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });
module.exports = { YearMasters };
