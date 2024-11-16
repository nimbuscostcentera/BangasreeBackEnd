const { sq } = require("../../DataBase/ormdb");
const { sequelize, DataTypes } = require("sequelize");
const PageMasters = sq.define("pagemasters", {
  PageId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  PageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Icon: {
    type: DataTypes.STRING,
  },
  Priority: {
    type: DataTypes.BIGINT,
  },
});

sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { PageMasters };
