const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = List = loader.database.define(
  'lists',
  {
    listId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    listName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    pictureSrc: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isSecret: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
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
        fields: ['isSecret']
      },
      {
        fields: ['createdAt']
      },
    ]
  }
);