const express = require('express');

const router = express.Router();
const Mongo = require('../utils/Mongo');

const { User } = Mongo;
/* GET users listing. */
// router.get('/', (req, res) => {
//   res.send('respond with a resource');
// });

router.get('/fetchUserInfo', (req, res) => {
  const { _id } = req.query;
  User.findById(_id).then((data) => {
    res.send(data);
  });
});

router.get('/talkList', (req, res) => {
  const { _id } = req.query;
  const result = [];

  User.findById(_id).then((doc) => {
    const list = doc.talking;
    result.push({
      _id: doc._id,
      name: doc.name,
      realName: doc.realName,
      gender: doc.gender,
      collage: doc.collage,
      major: doc.major,
      age: doc.age,
      grade: doc.grade,
      createTime: doc.createTime,
      avatar: doc.avatar,
      isOnline: doc.isOnline,
      onlineStatus: doc.onlineStatus,
    });
    const promises = list.map((id) => {
      return User.findById(id);
    });
    return Promise.all(promises);
  }).then((list) => {
    list.forEach((doc) => {
      result.push({
        _id: doc._id,
        name: doc.name,
        realName: doc.realName,
        gender: doc.gender,
        collage: doc.collage,
        major: doc.major,
        age: doc.age,
        grade: doc.grade,
        createTime: doc.createTime,
        avatar: doc.avatar,
        isOnline: doc.isOnline,
        onlineStatus: doc.onlineStatus,
      });
    });
    res.send(result);
  });
});

router.get('/addNewChat', (req, res) => {
  const { _id, targetId } = req.body;
  User.updateOne({ _id }, {
    $addToSet: {
      talking: targetId,
    },
  }).then(() => {
    res.send({ status: 0 });
  }).catch(() => {
    res.send({ status: 1, errMsg: '添加失败' });
  });
});

// router.get('/test', (req, res) => {
//   res.send('test');
// const lasia = {
//   name: 'sia',
//   account: '18075083007@163.com',
//   password: 'c5c3cec46d54a5db2dfe0a0fc10edb4c',
//   isOnline: true,
// };
// User.create(lasia).then((log) => {
//   console.log(log);
// });

// User.updateOne({ _id: '60d7534993947d0d70a2fd32' },
//   {
//     $addToSet: {
//       talking: '60d990af5ca36104b00cb271',
//     },
//   }).then((res) => {
//   console.log(res);
// });

// User.updateOne({ name: 'Lasia Yan' }, {
//   $set: { isOnline: true },
// }).then((res) => {
//   console.log(res);
// });

// User.updateMany({ }, {
//   $set: { studentId: '1211' },
// }, { multi: true, upsert: false }, (err, doc) => {
//   if (!err) {
//     console.log(doc);
//   }
// });
// });

// result.push({
//   _id: doc._id,
//   name: doc.name,
//   realName: doc.realName,
//   gender: doc.gender,
//   collage: doc.collage,
//   major: doc.major,
//   age: doc.age,
//   grade: doc.grade,
//   createTime: doc.createTime,
//   avatar: doc.avatar,
//   isOnline: doc.isOnline,
//   onlineStatus: doc.onlineStatus,
// });

module.exports = router;
