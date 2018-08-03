const express = require('express');
const router = express.Router();
const config = require('../config');
const User = require('../models/user');
const List = require('../models/list');
const Liststatistic = require('../models/liststatistics');
const apiTokenGenerator = require('../lib/api-token-generater');

router.get('/', async (req, res, next) => {

  if (req.user) {
    try {
      const apiToken = apiTokenGenerator(req.user.id, 60 * 60 * 24 * 7);
      const reqUser = await User.findOne({ where: { userId: req.user.id } });
      res.render('index', { title: config.PRODUCT_NAME, apiToken: apiToken, reqUser: reqUser });
    } catch (err) {
      console.error(err);
      return next();
    }
  } else {
    const officialLists = await List.findAll({
      where: { userId: config.ADMINUSERS[1] },
      include: [
        { model: User, attributes: ['userId', 'userName', 'photoSrc', 'displayName'] },
        { model: Liststatistic, attributes: ['listId'] }
      ],
    });
    res.render('lp', {
      title: config.PRODUCT_NAME,
      officialLists: officialLists
    });
  }

});

module.exports = router;
