const express = require('express');
const router = express.Router();
const moment = require('moment');
const apiTokenGenerator = require('../lib/api-token-generater');
const { asyncMap } = require('../lib/async_map');
const User = require('../models/user');
const Follow = require('../models/follow');

router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const apiToken = apiTokenGenerator(req.user.id, 60 * 60 * 24 * 7);
      const reqUser = await User.findOne({ where: { userId: req.user.id } });
      const follows = await Follow.findAll({
        where: { followUserId: reqUser.userId },
        order: [['createdAt', 'DESC']]
      });

      // 自分自身はデフォルトでフォローすることにしている簡易的ではあるが、ユーザーには不要な情報なのでここでフィルターする
      const followEvents = await asyncMap(follows.filter(e => e.userId !== e.followUserId), async e => {
        const createdAt = moment(e.createdAt).tz("Asia/Tokyo").format('YYYY/MM/DD HH:mm');
        const followingUser = await User.findOne({ where: { userId: e.userId } });
        return {
          name: "follow",
          createdAt: createdAt,
          userDisplayName: followingUser.displayName,
          photoSrc: followingUser.photoSrc,
        };
      });

      let events = [];
      events = followEvents;
      res.render('notification', {
        apiToken: apiToken,
        reqUser: reqUser,
        events: events,
      });
    }
  } catch (e) {
    console.error(e);
    return next();
  }
});

module.exports = router;
