const config = require('../config');
const Sequelize = require('sequelize');
const seqeulize = new Sequelize(
  process.env.DATABASE_URL || config.DATABASE_URL,
  { logging: false }
);

module.exports = {
  database: seqeulize,
  Sequelize: Sequelize
};