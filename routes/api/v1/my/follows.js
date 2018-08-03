const express = require('express');
const router = express.Router();
const apiTokenDecoder = require('../../../apiTokenDecoder');
const apiTokenEnsurer = require('../../../apiTokenEnsurer');
const Follow = require('../../../../models/follow');

router.get('/', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }
  try {
    const followlist = await Follow.findAll({ where: { userId: decodedApiToken.userId } });
    res.json(followlist);
  } catch (err) {
    console.error(err);
    res.json({ status: 'NG', message: 'Database error.' });
  }
});

router.post('/', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }

  try {
    const followUserId = req.body.followUserId;
    console.log(followUserId);
    const followUser = await Follow.create({ followUserId: followUserId, userId: decodedApiToken.userId });
    res.json({ status: 'OK', message: 'FollowUser add', followUser: followUser });
  } catch (err) {
    console.error(err);
    res.json({ status: 'NG', message: 'Database error.' });
  }

});

router.delete('/', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }
  try {
    const followUserId = req.body.followUserId;
    await Follow.destroy({ where: { followUserId: followUserId, userId: decodedApiToken.userId } });
    res.json({ statsu: 'OK', message: 'unfollow' });
  } catch (e) {
    console.error(e);
    res.json({ statsu: 'NG', message: 'Datebase error' });
  }
});

module.exports = router;