const { Sequelize } = require("sequelize");
const { devSQL } = require("../config");

const sequelize = new Sequelize(devSQL.database, devSQL.user, devSQL.password, {
  dialect: "mssql",
  host: devSQL.server,
});

const test = async () => {
  try {
    await sequelize.authenticate();
    console.log("successful connection");
  } catch (error) {
    console.log("Failed connection");
  }
};
// test();

module.exports = sequelize;
