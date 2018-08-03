const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = Follow = loader.database.define(
  'follows',
  {
    followUserId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: false,
    timestamps: true,
    indexes: [
      {
        fields: ['followUserId']
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