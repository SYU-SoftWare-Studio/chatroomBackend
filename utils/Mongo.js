const mongoose = require('mongoose');
const Collection = require('../collection');

const URL = 'mongodb://106.13.219.249:27017/test';

mongoose.connect(URL);

const db = mongoose.connection;

db.on('open', (err) => {
  if (err) {
    // eslint-disable-next-line
    console.log('connect failed');
    throw err;
  }
  // eslint-disable-next-line
  console.log('connect success');
});

// class Mongo {
//   static User() {
//     return mongoose.model('user', Collection.User());
//   }
// }

const User = mongoose.model('user', Collection.User());
const InviteCode = mongoose.model('inviteCode', Collection.InviteCode());

module.exports = {
  User,
  InviteCode,
};
