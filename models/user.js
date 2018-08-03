const loader = require('../lib/sequelize-loader');
const Sequelize = loader.Sequelize;

module.exports = User = loader.database.define(
  'users',
  {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    displayName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    photoSrc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    }
  },
  {
    freezeTableName: false,
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['userName']
      },
    ]
  }
);