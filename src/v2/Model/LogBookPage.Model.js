const {sq}=require("../../DataBase/ormdb");
const { DataTypes}=require("sequelize");
const LogBookPages = sq.define("logbookpages", {
  ID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  URL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PageName: {
    type: DataTypes?.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes?.STRING,
    allowNull: false,
  },
});
// sq.sync();
module.exports={LogBookPages};  