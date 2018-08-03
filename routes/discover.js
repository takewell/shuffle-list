const express = require('express');
const router = express.Router();
const config = require('../config');
const apiTokenGenerater = require('../lib/api-token-generater');
const User = require('../models/user');
const List = require('../models/list');
const Liststatistic = require('../models/liststatistics');
const { Sequelize } = require('../lib/sequelize-loader');

router.get('/', async (req, res, next) => {
  let apiToken = null;
  let reqUser = null;
  try {
    if (req.user) {
      apiToken = apiTokenGenerater(req.user.id, 60 * 60 * 24 * 7);
      reqUser = await User.findOne({ where: { userId: req.user.id } });
    }

    const lists = await List.findAll({
      where: { isSecret: { [Sequelize.Op.ne]: true } },
      include: [
        { model: User, attributes: ['userId', 'userName', 'photoSrc', 'displayName'] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }
      ],
      order: [[Liststatistic, 'goodCount', 'DESC']],
      limit: 16
    });

    const officialLists = await List.findAll({
      where: { userId: config.ADMINUSERS[1] },
      include: [
        { model: User, attributes: ['userId', 'userName', 'photoSrc', 'displayName'] },
        { model: Liststatistic, attributes: ['listId'] }
      ],
    });

    res.render('discover', { lists: lists, reqUser: reqUser, apiToken: apiToken, officialLists: officialLists });
  } catch (err) {
    console.error(err);
    return next();
  }
});

module.exports = router;
