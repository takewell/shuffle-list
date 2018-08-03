const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
  var loginFrom = req.cookies.loginFrom;
  // オープンリダイレクタ脆弱性対策
  if (loginFrom && loginFrom.indexOf('http://') < 0 && loginFrom.indexOf('https://') < 0) {
    res.clearCookie('loginFrom');
    res.redirect(loginFrom);
  } else {
    res.redirect('/');
  }
});

module.exports = router;