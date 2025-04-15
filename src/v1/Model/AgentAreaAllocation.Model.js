const { sq } = require("../../DataBase/ormdb");
const { sequelize, DataTypes } = require("sequelize");
const AgentAreaAllocations = sq.define("agentareaallocations", {
    AAAID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement:true
  },
  AreaID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "areamasters",
      key: "AreaID",
    },
  },
  AgentID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
        model: "agentmasters",
        key: "AgentID",
      },
  },
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
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
  
 module.exports={AgentAreaAllocations};