const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = loader.database.define(
  'bookmarks',
  {
    listId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    userId: {
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
        fields: ['listId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['createdAt']
      }
    ]
  }
);