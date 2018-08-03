const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = liststatistics = loader.database.define(
  'liststatistics',
  {
    listId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    shuffleCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    goodCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    bookmarkCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
  },
  {
    freezeTableName: false,
    timestamps: true,
    indexes: [
      {
        fields: ['listId']
      },
    ]
  }
);