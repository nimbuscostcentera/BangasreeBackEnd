const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');
uuidv4();
const { sequelize, DataTypes, UUID, UUIDV4 } = require("sequelize");
const NotificationDetails = sq.define("notificationdetails", {
  Notificationid:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },  
  TicketId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
        model: "notificationheaders",
        key: "TicketId",
      },
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
  ToUser:{
    type:DataTypes.BIGINT,
    allowNull:false
  },
  FromUser:
  {
    type:DataTypes.BIGINT,
    allowNull:false
  },
  Message:
  {
    type:DataTypes.STRING,
    allowNull:false    
  },
  Seen:{
    type:DataTypes.TINYINT        /// unread:1,read:2
  },
  Close:{
    type:DataTypes.INTEGER,
   
  },
  FromUserName:{
    type:DataTypes.STRING,
  }

});
// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });
module.exports = { NotificationDetails };