const { sq } = require("../../DataBase/ormdb");
const { DataTypes } = require("sequelize");
const { LogBookPages } = require("./LogBookPage.Model");
const { UserMasters } = require("./UserMaster.Model");

const LogBookList = sq.define(
  "logbooklists",
  {
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
        model: LogBookPages, // ✅ Use the imported model, not a string
        key: "ID",
      },
    },
    UserID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: UserMasters, // ✅ Use the imported model, not a string
        key: "UserID",
      },
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
  },
  { freezeTableName: true }
); // ✅ Prevent automatic pluralization

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

// (async () => {
//   await sq.sync(); // ✅ Ensure tables are created in order
//   await LogBookList.sync();
// })();

module.exports = { LogBookList };
