const { sq } = require("../../DataBase/ormdb");
const { v4: uuidv4 } = require("uuid");
const { Sequelize, DataTypes } = require("sequelize");
const AreaMasters = sq.define("areamasters", {
  AreaID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement:true
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "CompanyCode",
    },
  },
  AreaName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Pincode: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  District: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  Status: {
    type: DataTypes.BOOLEAN,
  },
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});

module.exports = { AreaMasters };
// module.exports={AreaMasters};
// module.exports = new AreaMasters()