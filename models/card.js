const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = Card = loader.database.define(
  'cards',
  {
    cardId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false, // At this point
    },
    pictureSrc: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    href: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    listId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: false,
    timestamps: true,
    indexes: [
      {
        fields: ['cardId']
      },
      {
        fields: ['listId']
      },
      {
        fields: ['createdAt']
      },
    ]
  }
);