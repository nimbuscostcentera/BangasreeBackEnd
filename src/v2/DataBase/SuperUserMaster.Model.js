const { sq } = require("../../config/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const Pwd = bcrypt.genSaltSync(10);
// console.log(Pwd);
const date = new Date();
const SuperUserMasters = sq.define("SuperUserMasters", {
  SuperUserID: {
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
      model: "CompanyMasters",
      key: "CompanyCode",
    },
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DID: {
    type: DataTypes.BIGINT,
    references: {
      model: "designations",
      key: "Did",
    },
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EmailId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RegistrationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Photo: {
    type: DataTypes.STRING,
  },
  Status: {
    type: DataTypes.BOOLEAN,
  },
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
const pass= "Abc@123";
const hashPassword = bcrypt.hashSync(pass, Pwd);
 console.log(hashPassword);
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

module.exports={SuperUserMasters};
