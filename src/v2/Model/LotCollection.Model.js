const { sq } = require("../../DataBase/ormdb");
const { Sequelize, DataTypes } = require("sequelize");
const Lotcollections = sq.define("lotcollections", {
  LotId: {
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
  AgentCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  CollectedAmt: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pic:{
    type:DataTypes.STRING,
    allowNull:true
  }  
});
// sq.sync().then(() => {
//   console.log("Table created successfully!");
// });
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
module.exports = { Lotcollections };
