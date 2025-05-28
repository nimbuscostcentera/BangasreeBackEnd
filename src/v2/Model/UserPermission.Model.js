const { sq } = require("../../DataBase/ormdb");
const { sequelize, DataTypes } = require("sequelize");
const UserPermissions = sq.define("userpermissions", {
  PId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
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
  Utype: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  UUid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PageId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "pagemasters",
      key: "PageId",
    },

  },
  View: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Add: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Edit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Del: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
});

// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });
module.exports = { UserPermissions };