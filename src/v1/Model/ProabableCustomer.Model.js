const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
const date = new Date();
const ProabableCustomers = sq.define("proabablecustomers", {
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
    allowNull: false,
    references: {
      model: "agentmasters",
      key: "AgentCode",
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
  ExecutiveCode: {
    type: DataTypes.STRING,
    unique: true,
  },
  CustomerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Gurdian: {
    type: DataTypes.STRING,
    
  },
  Address: {
    type: DataTypes.STRING,
    
  },
  LocalBody: {
    type: DataTypes.STRING,
  },
  LandMark: {
    type: DataTypes.STRING,
  },
  GeoLocation: {
    type: DataTypes.STRING,
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

  },
  Occupation: {
    type: DataTypes.STRING,
    
  },
  CustomerAccNo: {
    type: DataTypes.STRING,

  },
  Sex: {
    type: DataTypes.STRING,

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
  Nomineename: {
    type: DataTypes.STRING,

  },
  Relation: {
    type: DataTypes.STRING,

  },
  NomineeIdProofType: {
    type: DataTypes.STRING,

  },
  NomineeIdProofNumber: {
    type: DataTypes.STRING,

  },
  NomineeIdProofPhoto: {
    type: DataTypes.STRING,

  },
  NomineePhoto: {
    type: DataTypes.STRING,

  },
  Nomineesignature: {
    type: DataTypes.STRING,

  },
  password: {
    type: DataTypes.STRING,

  },
  Status: {
    type: DataTypes.STRING,

  },
  FollowUpDate: {
    type: DataTypes.DATEONLY,

  },
  BranchId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "branchmasters",
      key: "BranchId",
    },
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
module.exports = { ProabableCustomers };
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
