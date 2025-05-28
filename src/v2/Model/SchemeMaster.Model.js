const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes } = require("sequelize");
// console.log(Pwd);
const date = new Date();
const SchemeMasters = sq.define("schememasters", {
    GSSID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  SUUid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "companycode",
    },
  },
  SchemeTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BONUS: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Regfees:
  {
    type:DataTypes.FLOAT,
    allowNull:false,
  },
  Duration:
  {
    type:DataTypes.BIGINT,
    allowNull:false
  },
  Status: 
  {
    type:DataTypes.BOOLEAN,
    allowNull:false,
  },
  Daily:
  {
    type:DataTypes.INTEGER
  },
  Monthly:
  {
    type:DataTypes.INTEGER
  },
  Weekly:
  {
    type:DataTypes.INTEGER
  }
});

// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });

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

module.exports = { SchemeMasters };
