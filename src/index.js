const app = require("./app");
const config = require("./config");

const db = require("./data/database");

require("./models/Grocers");
require("./models/Sellers");
require("./models/Suppliers");

const syncTables = async () => {
  try {
    await db.sync();
    console.log("Syncing tables.");
    console.log("Successful connection.");
  } catch (error) {
    console.log(error.message);
  }
};

const server = async () => {
  await app.listen(config.port, () => {
    console.log("server dashboard on port:" + config.port);
  });
};

server();
syncTables();
