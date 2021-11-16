require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  User.findById('618563eff76c716e9231696c')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(console.log);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const connStr = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.ukzuz.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(connStr)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Stuart',
          email: 'stuhuggins@gmail.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(process.env.APP_PORT || 3000);
  })
  .catch(console.log);
