const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const uploader = require('../../../../lib/uploader');
const storeBrob = require('../../../../lib/storage');
const apiTokenDecoder = require('../../../apiTokenDecoder');
const apiTokenEnsurer = require('../../../apiTokenEnsurer');
const Card = require('../../../../models/card');

/** 
 * listId から カード一覧の配列を返す
 * @param  {string} listId
 * @return {array} cards
 */
router.get('/:listId', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }

  try {
    const listId = req.params.listId;
    const cards = await Card.findAll({ where: { listId: listId }, order: [['createdAt', 'DESC']], });
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.json({ status: 'NG', message: 'Database error.' });
  }
});

/**
 * @param {string} listId
 * @param {string} content 
 */
router.post('/', apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }

  try {
    const listId = req.body.listId;
    const contentType = req.body.contentType;
    const content = req.body.content;
    const cards = content.trim().split('\n').map(card => {
      let content = card.trim();
      let href = '';
      if (content.match(/^\[.*?\]\(.*?\)$/)) {
        content = content.replace(/^\[(.*?)\]\((.*?)\)$/, (match, $1, $2) => {
          href = $2;
          return $1;
        });
      }
      const cardId = shortid.generate();
      return {
        cardId: cardId,
        contentType: contentType,
        content: content,
        href: href,
        listId: listId,
      };
    });
    await Card.bulkCreate(cards);
    res.json({ statsu: 'OK', message: 'Create cards', cards: cards });
  } catch (err) {
    console.error(err);
    res.json({ statsu: 'NG', message: 'Datebase error' });
  }
});

router.put('/', apiTokenEnsurer, uploader.single('picture'), async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }

  try {
    const listId = req.body.listId;
    const cardId = req.body.cardId;
    const content = req.body.content;
    const href = req.body.href;
    let pictureSrc = null;
    if (req.file) {
      pictureSrc = await storeBrob(req.file.buffer, cardId + '-' + String(Math.round((new Date()).getTime() / 1000)));
    }
    await Card.update({ content: content, pictureSrc: pictureSrc, href: href },
      {
        where: {
          listId: listId, cardId: cardId
        }
      });
    const card = await Card.findOne({ where: { listId: listId, cardId: cardId } });
    res.json({ statsu: 'OK', message: 'Update card', card: card });
  } catch (err) {
    console.error(err);
    res.json({ statsu: 'NG', message: 'Datebase error' });
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
    const cardId = req.body.cardId;
    const card = await Card.findOne({ where: { listId: listId, cardId: cardId } });
    await Card.destroy({ where: { listId: listId, cardId: cardId } });
    res.json({ statsu: 'OK', message: 'Delete card', card: card });
  } catch (err) {
    console.error(err);
    res.json({ statsu: 'NG', message: 'Datebase error' });
  }
});

module.exports = router;