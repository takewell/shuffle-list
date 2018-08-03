const express = require('express');
const router = express.Router();
const apiTokenDecoder = require('../../../apiTokenDecoder');
const apiTokenEnsurer = require('../../../apiTokenEnsurer');
const Good = require('../../../../models/goods');
const Liststatistic = require('../../../../models/liststatistics');

router.get('/', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }
  try {
    const goods = await Good.findAll({ where: { userId: decodedApiToken.userId } });
    res.json(goods);
  } catch (err) {
    console.error(err);
    res.json({ status: 'NG', message: 'Database error.' });
  }
});

// listId からそのユーザーがブックマークしているか真偽値を返す
router.get('/:listId', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }
  try {
    const listId = req.params.listId;
    const isGood = await Good.findOne(
      { where: { userId: decodedApiToken.userId, listId: listId } }
    ) ? true : false;

    res.json(isGood);
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
    const listId = req.body.listId;
    const good = await Good.create({ listId: listId, userId: decodedApiToken.userId });
    await Liststatistic.increment('goodCount', { where: { listId: listId } });
    res.json({ status: 'OK', message: 'good add', good: good });
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
    const listId = req.body.listId;
    await Good.destroy({ where: { listId: listId, userId: decodedApiToken.userId } });
    const liststatistic = await Liststatistic.findById(listId);
    await liststatistic.decrement('goodCount', { by: 1 });
    res.json({ statsu: 'OK', message: 'Un good' });
  } catch (e) {
    console.error(e);
    res.json({ statsu: 'NG', message: 'Datebase error' });
  }
});

module.exports = router;