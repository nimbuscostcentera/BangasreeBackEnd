const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
const date = new Date();
const AgentMasters = sq.define("agentmasters", {
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
      model: "companymasters",
      key: "CompanyCode",
    },
  },
  SuperUserID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "superusermasters",
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
  IDProofType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IDProofNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  IDProofPhoto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Signature: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Commision: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  PassbookStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  AcSerial:
  {
    type:DataTypes.STRING,
    allowNull:false,
  },
  AreaID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "areamasters",
      key: "AreaID",
    },
  }
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});

module.exports = { AgentMasters };
// module.exports = new Agentmasters()
