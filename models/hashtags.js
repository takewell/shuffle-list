const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = loader.database.define(
  'hashtags',
  {
    hashtagName: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    listId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    }
  },
  {
    freezeTableName: false,
    timestamps: true,
    indexes: [
      {
        fields: ['hashtagName']
      },
      {
        fields: ['listId']
      },
    ]
  }
);