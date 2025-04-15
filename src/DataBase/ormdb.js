const { Sequelize } = require("sequelize");
const { HOST, dbUSER, DB, PASSWORD, POOL } = require("./db.config");
// Connection parameters
const sequelize = new Sequelize("BangasreeTest", "root", "5F2l!7RCGwUu3>8aL", {
  host: "13.201.168.169",
  dialect: "mysql",
  port:3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
// const sequelize = new Sequelize("bangasreetest", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
//   port: 3306,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// });
// with URI
//const sequelize = new Sequelize(process.env.POSTGRESQL_DB_URI)

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = { sq: sequelize, testDbConnection };
