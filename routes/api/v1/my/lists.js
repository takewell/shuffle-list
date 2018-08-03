const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const uploader = require("../../../../lib/uploader");
const storeBrob = require("../../../../lib/storage");
const apiTokenDecoder = require("../../../apiTokenDecoder");
const apiTokenEnsurer = require("../../../apiTokenEnsurer");
const List = require("../../../../models/list");
const Liststatistic = require("../../../../models/liststatistics");
const User = require("../../../../models/user");

router.get("/", apiTokenEnsurer, async (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: "NG", message: "Api token not correct." });
    return;
  }

  try {
    const lists = await List.findAll({
      where: { userId: decodedApiToken.userId },
      include: [
        { model: User, attributes: ["userId", "userName"] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }
      ]
    });
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.json({ status: "NG", message: "Database error." });
  }
});

router.post("/", apiTokenEnsurer, uploader.single("picture"), async (req, res) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: "NG", message: "Api token not correct." });
    return;
  }

  try {
    const listId = shortid.generate();
    const listName = req.body.listName;
    const description = req.body.description || "";
    let pictureSrc = null;
    if (req.file) {
      pictureSrc = await storeBrob(
        req.file.buffer,
        listId + "-" + String(Math.round(new Date().getTime() / 1000))
      );
    }
    const isSecret = req.body.isSecret;
    const userId = decodedApiToken.userId;
    await Liststatistic.create({
      listId: listId,
      shuffleCount: 0,
      goodCount: 0,
      bookmarkCount: 0
    });
    await List.create({
      listId: listId,
      description: description,
      listName: listName,
      pictureSrc: pictureSrc,
      isSecret: isSecret,
      userId: userId
    });
    const list = await List.findOne({
      where: { listId: listId, userId: decodedApiToken.userId },
      include: [
        { model: User, attributes: ["userId", "userName"] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }
      ]
    });
    res.json({ status: "OK", message: "Created Lists", list: list });
  } catch (err) {
    console.error(err);
    res.json({ status: "NG", message: "Database error." });
  }
}
);

router.put("/", apiTokenEnsurer, uploader.single("picture"), async (req, res) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: "NG", message: "Api token not correct." });
    return;
  }

  try {
    const reqUserId = decodedApiToken.userId;
    const listId = req.body.listId;
    const listName = req.body.listName;
    const description = req.body.description;
    const isSecret = req.body.isSecret;
    const preList = await List.findOne({ where: { listId: listId } });
    let pictureSrc = preList.pictureSrc;
    if (req.file) {
      pictureSrc = await storeBrob(
        req.file.buffer,
        listId + "-" + String(Math.round(new Date().getTime() / 1000))
      );
    }

    await List.update(
      {
        listName: listName,
        description: description,
        pictureSrc: pictureSrc,
        isSecret: isSecret
      },
      {
        where: { listId: listId, userId: reqUserId }
      }
    );
    const list = await List.findOne({
      where: { listId: listId },
      include: [
        { model: User, attributes: ["userId", "userName"] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }]
    });

    res.json({ statsu: "OK", message: "Update list", list: list });
  } catch (err) {
    console.error(err);
    res.json({ status: "NG", message: "Database error." });
  }
}
);

router.delete("/", apiTokenEnsurer, async (req, res) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: "NG", message: "Api token not correct." });
    return;
  }

  try {
    const listId = req.body.listId;
    const list = await List.findOne({
      where: { listId: listId, userId: decodedApiToken.userId },
      include: [
        { model: User, attributes: ["userId", "userName"] },
        { model: Liststatistic, attributes: ['listId', 'shuffleCount', 'goodCount', 'bookmarkCount'] }
      ]
    });
    await List.destroy({
      where: { listId: listId, userId: decodedApiToken.userId }
    });
    res.json({ statsu: "OK", message: "Delete list", list: list });
  } catch (e) {
    console.error(e);
    res.json({ statsu: "NG", message: "Datebase error" });
  }
});

module.exports = router;