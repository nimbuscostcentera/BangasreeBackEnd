const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');
uuidv4();
const { sequelize, DataTypes, UUID, UUIDV4 } = require("sequelize");
const NotificationHeaders = sq.define("notificationheaders", {
  TicketId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "CompanyCode",
    },
  },
  Subject:{
    type: DataTypes.STRING,
    allowNull:false
  },
  Close:{
    type:DataTypes.TINYINT,     /// unclose:1,close:2
   
  }
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { NotificationHeaders };