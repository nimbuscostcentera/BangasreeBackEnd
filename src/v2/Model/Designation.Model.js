const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');

const { sequelize, DataTypes } = require("sequelize");
const designations = sq.define("designations", {
  Did: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  UUid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references:
    {
    model:'companymasters',
      key: "CompanyCode"
    }
  },
  Designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Status: {
    type: DataTypes.BOOLEAN,
  },
});
// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });
module.exports = { designations };
// const d1 = designations.create({
//   UUid: uuidv4(),
//   CompanyCode: "BGPL",
//   Designation: "Backoffice User",
//   Status: true
// }
// )