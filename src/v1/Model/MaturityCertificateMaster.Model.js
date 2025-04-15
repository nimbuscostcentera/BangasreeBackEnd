const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require('uuid');

const { sequelize, DataTypes } = require("sequelize");
const MaturityCertificateMaster = sq.define("maturitycertificate", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  CustomerAccNo: {
    type: DataTypes.STRING,
    unique: true,
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
  MaturityStatus: {
    type: DataTypes.INTEGER,
   
  },
  MaturityComment: {
    type: DataTypes.STRING,
  },
  TotalDepositedAmount:{
    type:DataTypes.BIGINT
  },
  NoOfInstallments:{
    type:DataTypes.BIGINT
  },
  RedeemAmt:
  {
    type:DataTypes.FLOAT,
  },
  MaturityDate:
  {
    type:DataTypes.DATEONLY,
  },
  SchemeRegId: {
    type: DataTypes.BIGINT,
    references: {
      model: "schemeregisters",
      key: "ID",
    },
  },
  BillNumber:{
    type:DataTypes.STRING
  },
  Totalbillamount:{
    type:DataTypes.FLOAT
  },
  Billingdate:
  {
    type:DataTypes.DATEONLY
  },
  Ordernumber:{
    type:DataTypes.STRING
  },
  Orderdate:{
    type:DataTypes.DATEONLY
  },
  Description:{
    type:DataTypes.STRING
  },
  Totalweight:{
    type:DataTypes.FLOAT
  }
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { MaturityCertificateMaster };
// const d1 = designations.create({
//   UUid: uuidv4(),
//   CompanyCode: "BGPL",
//   Designation: "Backoffice User",
//   Status: true
// }
// )