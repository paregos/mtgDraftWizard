const Sequelize = require('sequelize');

const Card = require('./card');

const sequelize = new Sequelize('', '', '', {
  dialect: 'sqlite',
  storage: 'db.sqlite',
  logging: false
});

const syncedPromise = sequelize
  .authenticate()
  .then(() => {
    console.log('Syncing Database...');
    if(process.env.MTGA_RESET_TABLES == 'true') {
      console.log('Rebuilding tables...');
    }
    return sequelize.sync({ force: process.env.MTGA_RESET_TABLES == 'true' })
  })
  .then(() => {
    console.log('Database Synced');
  });

module.exports = {
  sequelize,
  syncedPromise,
  Card: Card(sequelize, Sequelize)
}