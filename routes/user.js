const express = require('express');
const router = express.Router();
const apiTokenGenerater = require('../lib/api-token-generater');
const User = require('../models/user');
const Liststatistic = require('../models/liststatistics');
const List = require('../models/list');
const Follow = require('../models/follow');
const { Sequelize } = require('../lib/sequelize-loader');
const { asyncMap } = require('../lib/async_map');

router.get('/:userName', async (req, res, next) => {
  let apiToken = null;
  let reqUser = null;
  try {
    if (req.user) {
      apiToken = apiTokenGenerater(req.user.id, 60 * 60 * 24 * 7);
      reqUser = await User.findOne({ where: { userId: req.user.id } });
    }
    const userName = req.params.userName;
    const user = await User.findOne({ where: { userName: userName } });
    const lists = await List.findAll({
      where: { userId: user.userId, isSecret: { [Sequelize.Op.ne]: true } },
      include: [
        { model: User, attributes: ['userId', 'userName'] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }
      ],
      order: [['createdAt', 'DESC']],
    });
    if (!user) return next();
    res.render('userlist', {
      reqUser: reqUser,
      user: user,
      apiToken: apiToken,
      lists: lists,
    });
  } catch (err) {
    console.error(err);
    return next();
  }
});

router.get('/:userName/following', async (req, res, next) => {
  let apiToken = '';
  let reqUser = '';
  try {
    if (req.user) {
      apiToken = apiTokenGenerater(req.user.id, 60 * 60 * 24 * 7);
      reqUser = await User.findOne({ where: { userId: req.user.id } });
    }
    const user = await User.findOne({ where: { userName: req.params.userName } });
    // 対象のユーザーが存在しない場合
    if (!user) return next();
    const a = await Follow.findAll({ where: { userId: user.userId } }, { order: [['createdAt', 'DESC']], });
    const followings = await asyncMap(a.filter(e => e.userId !== e.followUserId), async e => {
      return User.findOne({ where: { userId: e.followUserId } });
    });
    res.render('following', {
      reqUser: reqUser,
      apiToken: apiToken,
      user: user,
      followings: followings
    });
  } catch (e) {
    console.error(e);
    return next();
  }
});

router.get('/:userName/followers', async (req, res, next) => {
  let apiToken = '';
  let reqUser = '';
  try {
    if (req.user) {
      apiToken = apiTokenGenerater(req.user.id, 60 * 60 * 24 * 7);
      reqUser = await User.findOne({ where: { userId: req.user.id } });
    }
    const userName = req.params.userName;
    const user = await User.findOne({
      where: { userName: userName }
    });
    // 対象のユーザーが存在しない場合
    if (!user) return next();

    const a = await Follow.findAll({
      where: { followUserId: user.userId }, include: [{ model: User, attributes: ['userId', 'userName', 'displayName', 'description', 'photoSrc'] },]
    }, { order: [['createdAt', 'DESC']], });
    const followers = a.filter(e => e.userId !== e.followUserId);
    res.render('followers', {
      reqUser: reqUser,
      apiToken: apiToken,
      user: user,
      followers: followers
    });
  } catch (err) {
    console.error(err);
    return next();
  }
});

module.exports = router;
