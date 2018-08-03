const express = require('express');
const router = express.Router();
const List = require('../../models/list');
const User = require('../../models/user');
const Card = require('../../models/card');
const Liststatistic = require('../../models/liststatistics');
const apiTokenGenerater = require('../../lib/api-token-generater');

router.get('/:userName/:listId', async (req, res, next) => {
  let apiToken = null;
  let reqUser = null;
  try {
    if (req.user) {
      apiToken = apiTokenGenerater(req.user.id, 60 * 60 * 24 * 7);
      reqUser = await User.findOne({ where: { userId: req.user.id } });
    }
    const user = await User.findOne({ where: { userName: req.params.userName } });
    const list = await List.findOne({
      where: { listId: req.params.listId, userId: user.userId },
      include: [
        { model: User, attributes: ['userId', 'userName', 'photoSrc', 'displayName'] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }
      ],
    });
    if (!list) {
      return res.render('notlist');
    }
    const cards = await Card.findAll({ where: { listId: list.listId } }, { order: [['createdAt', 'DESC']] });
    res.render('my/lists', {
      list: list,
      cards: cards,
      reqUser: reqUser,
      apiToken: apiToken
    });
  } catch (e) {
    console.error(e);
    return next();
  }
});

module.exports = router;
