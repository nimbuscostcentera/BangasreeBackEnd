const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
// console.log(Pwd);

const SchemeRegisters = sq.define("schemeregisters", {
  ID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  SUUid: {
    type: DataTypes.STRING,
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
  UUid: {
    type: DataTypes.STRING,
    allowNull: false,
    // references: {
    //   model: "CustomerMasters",
    //   key: "UUid",
    // },
  },
  StartDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  MaturityStatus: {
    type: DataTypes.TINYINT, // inactive 0 ,matured 3,active 1,premature 2
    allowNull: false,
  },
  BonusStatus: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  AcSerial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CustomerAccNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EMI: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BonusComment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MaturityComment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  RedeemAmt: {
    type: DataTypes.FLOAT,
  },
  Wallet: {
    type: DataTypes.FLOAT,
  },
  MatureAmt: {
    type: DataTypes.FLOAT,
  },
  PassBookNo: {
    type: DataTypes.STRING,
  },
  regfees: {
    type: DataTypes.DOUBLE(10, 2),
  },
  Nomineename: {
    type: DataTypes.STRING,
  },
  NomineeDOB: {
    type: DataTypes.DATEONLY,
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
  RegfeesTaken:{
    type: DataTypes.TINYINT, // inactive 0 ,matured 3,active 1,premature 2
    allowNull: true,
  }
});

sq.sync().then(() => {
  console.log("Table created successfully!");
});

// const pass = "Abc@123";
// const hashPassword = bcrypt.hashSync(pass, Pwd);
// console.log(hashPassword);
// const su1 = SuperUserMasters.create({
//   UUid: uuidv4(),
//   CompanyCode: "BGPL",
//   Name: "Debolina Das",
//   Password: hashPassword,
//   DID: 1,
//   PhoneNumber: "6546544654",
//   EmailId: "debolina420@gmail.com",
//   RegistrationDate: date,
//   Photo:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUqaOWaydrrJYTbm0OELlbHzzVB8vNTh6BNKbGk5GFSsjEVxBLY_BzR4Hzgs-kBbeQfBE&usqp=CAU",
//   Status: true,
// });

module.exports = { SchemeRegisters };
