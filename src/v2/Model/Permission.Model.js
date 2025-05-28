const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
const Permissions = sq.define("userpermissions", {
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
  Module_Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pathName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Edit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Create: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  View: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
});

// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });
module.exports = { UserPermissions };
