const { sq } = require("../../config/ormdb");
const { v4: uuidv4 } = require("uuid");

const { sequelize, DataTypes } = require("sequelize");
const AreaMasters = sq.define("AreaMasters", {
  AreaID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement:true
  },
  UUid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "CompanyMasters",
      key: "CompanyCode",
    },
  },
  AreaName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Pincode: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  District: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  Status: {
    type: DataTypes.BOOLEAN,
  },
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
//  const A1 = AreaMasters.create({
//   UUid:uuidv4(),
//   CompanyCode: "BGPL",
//   AreaName:"Gariahat",
//   Pincode:700020,
//   District:"Kolkata",
//   state:"West Bengal",
//   country: "India",
//   Status:true,
// }
// )
