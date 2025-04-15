const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
// console.log(Pwd);
const date = new Date();
const UserMasters = sq.define("usermasters", {
  UserID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
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
  BranchId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "branchmasters",
      key: "BranchId",
    },
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UUid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
  },
  PhoneNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Utype: {
    type: DataTypes.BIGINT,
  },
  LogOut:{
    type: DataTypes.TINYINT,
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

module.exports = { UserMasters };
/*INSERT INTO `usermasters`(`CompanyCode`, `UserName`, `UUid`, `Eamil`, `PhoneNumber`, `Password`, `Utype`, `createdAt`, `updatedAt`)select `CompanyCode`,`CustomerName`,`UUid`,`EmailId`,`PhoneNumber`,`password`,3,`createdAt`, `updatedAt` from customermasters;*/
/*INSERT INTO `usermasters`(`CompanyCode`, `UserName`, `UUid`, `Eamil`, `PhoneNumber`, `Password`, `Utype`, `createdAt`, `updatedAt`)select `CompanyCode`,`Name`,`UUid`,`EmailId`,`Phonenumber`,`password`,2,`createdAt`, `updatedAt` from agentmasters;*/
