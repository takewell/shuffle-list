const express = require('express');
const paginate = require('express-paginate');
const router = express.Router();
const User = require('../models/user');
const List = require('../models/list');
const Liststatistic = require('../models/liststatistics');
const apiTokenGenerator = require('../lib/api-token-generater');
const { Sequelize } = require('../lib/sequelize-loader');

router.get('/', async (req, res, next) => {
  try {
    const results = await List.findAndCountAll({
      where: { isSecret: { [Sequelize.Op.ne]: true } },
      limit: req.query.limit,
      offset: req.skip,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['userId', 'userName', 'photoSrc', 'displayName'] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] },
      ],
    });

    const itemCount = results.count;
    const pageCount = Math.ceil(itemCount / req.query.limit);
    let reqUser = null;
    let apiToken = null;
    if (req.user) {
      apiToken = apiTokenGenerator(req.user.id, 60 * 60 * 24 * 7);
      reqUser = await User.findOne({ where: { userId: req.user.id } });
    }
    res.render('all', {
      lists: results.rows,
      reqUser: reqUser,
      apiToken: apiToken,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
  } catch (err) {
    console.error(err);
    return next();
  }
});

module.exports = router;