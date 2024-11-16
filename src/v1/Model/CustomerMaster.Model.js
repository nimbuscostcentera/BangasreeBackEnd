const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
const date = new Date();
const CustomerMasters = sq.define("customermasters", {
  CustomerID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
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
  AgentCode: {
    type: DataTypes.STRING,
  },
  SuperUserID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "superusermasters",
      key: "SuperUserID",
    },
  },
  CustomerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Guardian: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LocalBody: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LandMark: {
    type: DataTypes.STRING,
    
  },
  GeoLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AlternateNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  EmailId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DOB: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Occupation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IdProofType: {
    type: DataTypes.STRING,
  },
  IdProofNumber: {
    type: DataTypes.STRING,
  },
  IdProofPhoto: {
    type: DataTypes.STRING,
  },
  AplicantPhoto: {
    type: DataTypes.STRING,
  },
  Customersignature: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  StatusComment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  AreaID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "areamasters",
      key: "AreaID",
    },
  },
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports = { CustomerMasters };
// const su1 = SuperUserMasters.create({
//   UUid:uuidv4(),
//   CompanyCode:"BGPL",
//   Name: "Debolina Halder",
//   Password:"abc@123",
//   DID:1,
//   PhoneNumber:"6546544654",
//   EmailId:"debolina@gmail.com",
//   RegistrationDate:date,
//   Photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUqaOWaydrrJYTbm0OELlbHzzVB8vNTh6BNKbGk5GFSsjEVxBLY_BzR4Hzgs-kBbeQfBE&usqp=CAU",
//   Status:true,
// })
