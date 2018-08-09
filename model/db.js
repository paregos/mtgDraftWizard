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
    return sequelize.sync({ force: false })
  })
  .then(() => {
    console.log('Database Synced');
  });

module.exports = {
  sequelize,
  syncedPromise,
  Card: Card(sequelize, Sequelize)
}