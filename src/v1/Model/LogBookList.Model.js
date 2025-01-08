const {sq}=require("../../DataBase/ormdb");
const {DataTypes}=require("sequelize");
const { LogBookPages } = require("./LogBookPage.Model");
const { UserMasters } = require("./UserMaster.Model");
const LogBookList = sq.define("logbooklists", {
  LogID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  LogBookPageID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "logbookpages",
      key: "ID",
    },
  },
  UserID: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  DateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Request: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Remark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

LogBookList.belongsTo(LogBookPages, {
  foreignKey: "LogBookPageID",
  targetKey: "ID",
  as: "lgp",
});
LogBookList.belongsTo(UserMasters, {
  foreignKey: "UserID",
  targetKey: "UserID",
  as: "um",
});

sq.sync();
module.exports={LogBookList};  