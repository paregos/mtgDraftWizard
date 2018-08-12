const Sequelize = require("sequelize");

const Card = require("./card");

// const sequelize = new Sequelize('', '', '', {
//   dialect: 'sqlite',
//   storage: 'db.sqlite',
//   logging: false
// });
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_NAME, process.env.DB_NAME, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const syncedPromise = sequelize
    .authenticate()
    .then(() => {
        console.log("Syncing Database...");
        if (process.env.MTGA_RESET_TABLES == "true") {
            console.log("Rebuilding tables...");
        }
        return sequelize.sync({ force: process.env.MTGA_RESET_TABLES == "true" });
    })
    .then(() => {
        console.log("Database Synced");
    });

module.exports = {
    sequelize,
    syncedPromise,
    Card: Card(sequelize, Sequelize)
};
