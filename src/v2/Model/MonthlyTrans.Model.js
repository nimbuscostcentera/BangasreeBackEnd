const { setRandomFallback } = require("bcryptjs");
const { sq } = require("../../DataBase/ormdb");
const { Sequelize, DataTypes } = require("sequelize");
const MonthlyTrans = sq.define("monthlytrans", {
  CollectionId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "companymasters",
      key: "CompanyCode",
    },
  },
  SchemeRegId: {
    type: DataTypes.BIGINT,
  },
  Month:{
    type:DataTypes.STRING,
    allowNull:false
  },
  ExpectedCollection:{
    type:DataTypes.FLOAT,
    allowNull:false
  },
  ActualCollection:{
    type:DataTypes.FLOAT,
    allowNull:false
  },
  WalletBalance:
  {
    type:DataTypes.FLOAT,
  }
});
// sq.sync().then(() => {
//     console.log("Table created successfully!");
//   });
// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });
//  const A1 = AgentAreaAllocations.create({

//   AreaID: 1,
//   AgentID:1,
// }
// )
// const A2 = AgentAreaAllocations.create({

//     AreaID: 3,
//     AgentID:1,
//   }
//   )
  
//   const A3 = AgentAreaAllocations.create({

//     AreaID: 3,
//     AgentID:5,
//   }
//   )
  
// module.exports={AgentAreaAllocations};
// module.exports = new AgentAreaAllocations()
module.exports = { MonthlyTrans };