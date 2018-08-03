const express = require('express');
const paginate = require('express-paginate');
const router = express.Router();
const User = require('../models/user');
const List = require('../models/list');
const Follow = require('../models/follow');
const Liststatistic = require('../models/liststatistics');
const apiTokenGenerator = require('../lib/api-token-generater');
const { Sequelize } = require('../lib/sequelize-loader');
const { asyncMap } = require('../lib/async_map');


router.get('/', async (req, res, next) => {
  let reqUser = null;
  let apiToken = null;
  let itemCount = null;
  let pageCount = null;
  let lists = null;
  try {
    if (req.user) {
      apiToken = apiTokenGenerator(req.user.id, 60 * 60 * 24 * 7);
      reqUser = await User.findOne({ where: { userId: req.user.id } });
      const a = await Follow.findAll({ where: { userId: req.user.id } });
      const followings = await asyncMap(a.filter(e => e.userId !== e.followUserId), async e => {
        const user = await User.findOne({ where: { userId: e.followUserId } });
        return { userId: user.userId };
      });
      const results = await List.findAndCountAll({
        where: { [Sequelize.Op.or]: followings, isSecret: { [Sequelize.Op.ne]: true } },
        limit: req.query.limit,
        offset: req.skip,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, attributes: ['userId', 'userName', 'photoSrc', 'displayName'] },
          { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] },
        ],
      });
      itemCount = results.count;
      pageCount = Math.ceil(itemCount / req.query.limit);
      lists = results.rows;
    } else {
      return next();
    }
    res.render('timeline', {
      lists: lists,
      reqUser: reqUser,
      apiToken: apiToken,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
  } catch (err) {
    console.error(err);
    next();
  }
});

module.exports = router;
