const express = require('express');
const router = express.Router();
const apiTokenDecoder = require('../../../apiTokenDecoder');
const apiTokenEnsurer = require('../../../apiTokenEnsurer');
const Bookmark = require('../../../../models/bookmarks');
const List = require('../../../../models/list');
const Liststatistic = require('../../../../models/liststatistics');
const { Sequelize } = require('../../../../lib/sequelize-loader');

router.get('/', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }
  try {
    const bookmarks = await Bookmark.findAll({ where: { userId: decodedApiToken.userId } });
    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.json({ status: 'NG', message: 'Database error.' });
  }
});

router.get('/lists', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }
  try {
    const bookmarks = await Bookmark.findAll({ where: { userId: decodedApiToken.userId } });
    const bookmarkListIds = bookmarks.map(e => {
      return { listId: e.listId };
    });

    const bookmarkLists = await List.findAll({
      where: { [Sequelize.Op.or]: bookmarkListIds },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['userId', 'userName'] },
      ],
    });
    res.json(bookmarkLists);
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
    const isBookmark = await Bookmark.findOne(
      { where: { userId: decodedApiToken.userId, listId: listId } }
    ) ? true : false;

    res.json(isBookmark);
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
    const bookmark = await Bookmark.create({ listId: listId, userId: decodedApiToken.userId });
    await Liststatistic.increment('bookmarkCount', { where: { listId: listId } });
    res.json({ status: 'OK', message: 'Bookmark add', bookmark: bookmark });
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
    await Bookmark.destroy({ where: { listId: listId, userId: decodedApiToken.userId } });
    await Liststatistic.decrement('bookmarkCount', { where: { listId: listId } });
    res.json({ statsu: 'OK', message: 'Un Bookmark' });
  } catch (e) {
    console.error(e);
    res.json({ statsu: 'NG', message: 'Datebase error' });
  }
});

module.exports = router;