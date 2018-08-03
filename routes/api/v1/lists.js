const express = require('express');
const router = express.Router();
const apiTokenDecoder = require('../../apiTokenDecoder');
const apiTokenEnsurer = require('../../apiTokenEnsurer');
const List = require('../../../models/list');
const Liststatistic = require('../../../models/liststatistics');
const User = require('../../../models/user');

router.get('/', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }

  try {
    const a = await List.findAll({
      include: [
        { model: User, attributes: ['userId', 'userName'] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }
      ],
    }, { order: [['createdAt', 'DESC']], });
    const lists = a.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.json({ status: 'NG', message: 'Database error.' });
  }
});

router.get('/:listId', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }
  const listId = req.params.listId;
  try {
    const list = await List.findOne({
      where: { listId: listId },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.json({ status: 'NG', message: 'Database error.' });
  }
});

module.exports = router;