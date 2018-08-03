const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const paginate = require('express-paginate');
const TwitterStrategy = require('./lib/passport-twitter/index').Strategy;
const config = require('./config');

// Models
const User = require('./models/user');
const Follow = require('./models/follow');
const List = require('./models/list');
const Card = require('./models/card');
const Liststatistic = require('./models/liststatistics');
const Bookmark = require('./models/bookmarks');
const Good = require('./models/goods');

// データベースがクリーンな時のみ実行される
(async () => {
  await User.sync();
  Follow.belongsTo(User, { foreignKey: 'userId' });
  await Follow.sync();
  Good.belongsTo(User, { foreignKey: 'userId' });
  await Liststatistic.sync();
  Bookmark.belongsTo(User, { foreignKey: 'userId' });
  Good.belongsTo(Liststatistic, { foreignKey: 'listId' });
  await Good.sync();
  Bookmark.belongsTo(Liststatistic, { foreignKey: 'listId' });
  await Bookmark.sync();
  List.belongsTo(User, { foreignKey: 'userId' });
  List.belongsTo(Liststatistic, { foreignKey: 'listId' });
  await List.sync();
  Card.belongsTo(Liststatistic, { foreignKey: 'listId' });
  await Card.sync();
})();

const app = express();

passport.serializeUser(async (user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || config.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || config.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.URL_ROOT ? `${process.env.URL_ROOT}auth/twitter/callback` : `${config.URL_ROOT}auth/twitter/callback`,
    includeEmail: true
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(async () => {
      let isAdmin = false;
      config.ADMINUSERS.forEach(e => {
        if (e === profile.id.toString()) {
          isAdmin = true;
        }
      });
      const email = profile.emails ? profile.emails[0].value : '';
      const descriptipn = profile.description ? profile.description : '';
      await User.upsert({
        userId: profile.id,
        email: email,
        userName: profile.username,
        description: descriptipn,
        displayName: profile.displayName,
        photoSrc: profile.photos[0].value,
        isAdmin: isAdmin,
      });
      await Follow.upsert({ followUserId: profile.id, userId: profile.id });
      done(null, profile);
    });
  }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'images/favicon.png')));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: new RedisStore(process.env.REDIS_URL ?
    {
      url: process.env.REDIS_URL
    }
    : {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT
    }),
  secret: config.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto' }
}));

app.use(passport.initialize());
app.use(passport.session());
// 表示の関係から 4 の倍数がよい
app.use(paginate.middleware(16, 16 * 8));

// router
const index = require('./routes/index');
app.use('/', index);
const auth = require('./routes/auth');
app.use('/auth', auth);
const logout = require('./routes/logout');
app.use('/logout', logout);

// 静的ページ
app.use('/terms-of-service', async (req, res) => {
  let reqUser = null;
  if (req.user) {
    reqUser = await User.findOne({ where: { userId: req.user.id } });
  }
  res.render('terms_of_service', { reqUser: reqUser });
});
app.use('/privacy_policy', async (req, res) => {
  let reqUser = null;
  if (req.user) {
    reqUser = await User.findOne({ where: { userId: req.user.id } });
  }
  res.render('privacy_policy', { reqUser: reqUser });
});

const discover = require('./routes/discover');
app.use('/discover', discover);
const all = require('./routes/all');
app.use('/all', all);
const timeline = require('./routes/timeline');
app.use('/timeline', timeline);
const notification = require('./routes/notification');
app.use('/notification', notification);

const user = require('./routes/user');
app.use('/', user);
const myLists = require('./routes/my/lists');
app.use('/', myLists);

const apiV1Lists = require('./routes/api/v1/lists');
app.use('/v1/lists', apiV1Lists);
const apiV1MyFollows = require('./routes/api/v1/my/follows');
app.use('/v1/my/follows', apiV1MyFollows);
const apiV1MyLists = require('./routes/api/v1/my/lists');
app.use('/v1/my/lists', apiV1MyLists);
const apiV1MyCards = require('./routes/api/v1/my/cards');
app.use('/v1/my/cards', apiV1MyCards);
const apiV1MyBookmarks = require('./routes/api/v1/my/bookmarks');
app.use('/v1/my/bookmarks', apiV1MyBookmarks);
const apiV1MyGoods = require('./routes/api/v1/my/goods');
app.use('/v1/my/goods', apiV1MyGoods);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err.stack);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
