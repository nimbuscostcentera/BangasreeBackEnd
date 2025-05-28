const { sq } = require("../../DataBase/ormdb");
const { Sequelize, DataTypes } = require("sequelize");
const EmiTrans = sq.define("emitrans", {
  CollectionId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  CollectionUUId: {
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
  SUUid: {
    type: DataTypes.STRING,
  },
  AgentUUid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CustomerUUid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CollDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  CollectedAmt: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  PaymentMode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PaymentStatus: {
    type: DataTypes.SMALLINT, //1:Collected/Processing 2:Submitted 3:Approved 4:Rejected
    allowNull: false,
  },
  ChqNO: {
    type: DataTypes.BIGINT,
  },
  ChqDate: {
    type: DataTypes.DATEONLY,
  },
  MICR: {
    type: DataTypes.STRING,
  },
  TransactionId: {
    type: DataTypes.BIGINT,
  },
  ReceiptNo: {
    type: DataTypes.STRING,
  },
  SchemeRegId: {
    type: DataTypes.BIGINT,
    references: {
      model: "schemeregisters",
      key: "ID",
    },
  },
  PaymentType: {
    type: DataTypes.TINYINT, // 1:regfess 2:Emi
  },
  NotAgentPayment: {
    type: DataTypes.INTEGER,
  },
  AreaID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "areamasters",
      key: "AreaID",
    },
  },
  LotId: {
    type: DataTypes.BIGINT,
    references: {
      model: "lotcollections",
      key: "LotId",
    },
  },
  gold_rate: {
    type: DataTypes.DOUBLE(10, 2),
    allowNull: true,
  },
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
module.exports = { EmiTrans };
