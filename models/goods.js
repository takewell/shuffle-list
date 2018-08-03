const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = loader.database.define(
  'goods',
  {
    listId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
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