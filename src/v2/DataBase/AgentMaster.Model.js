const { sq } = require("../../config/ormdb");
const { v4: uuidv4 } = require("uuid");
const {Sequelize, DataTypes} = require("sequelize");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
const date = new Date();
const AgentMasters = sq.define("AgentMasters", {
  AgentID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  AgentCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
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
  SuperUserID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "SuperUserMasters",
      key: "SuperUserID",
    },
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Geolocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EmailId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  RegistrationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  BankName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AccountType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AccountNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  IFSCCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MICR: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  NomineeName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Relation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DOB: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IDProof: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Commision: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  PassbookStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Status: {
    type: DataTypes.BOOLEAN,
  },
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});

module.exports={AgentMasters};

