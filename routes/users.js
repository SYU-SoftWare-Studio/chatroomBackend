const express = require('express');

const router = express.Router();
const Mongo = require('../utils/Mongo');
const { Tools } = require('../engine');
const invitation = require('../utils/Invitation');

const { User, InviteCode } = Mongo;
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

router.get('/fetchOthersInfo', (req, res) => {
  const { _id } = req.query;
  User.findById(_id).then((doc) => {
    const value = {
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
      studentId: doc.studentId,
    };
    res.send({ status: 0, value });
  }).catch(() => {
    res.send({ status: 1, errMsg: '服务器错误' });
  });
});

router.get('/talkList', (req, res) => {
  const { _id } = req.query;
  const result = [];

  User.findById(_id)
    .then((doc) => {
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
        studentId: doc.studentId,
      });
      const promises = list.map((id) => {
        return User.findById(id);
      });
      return Promise.all(promises);
    })
    .then((list) => {
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
          studentId: doc.studentId,
        });
      });
      res.send(result);
    });
});

router.get('/addNewChat', (req, res) => {
  const { _id, targetId } = req.query;
  User.updateOne(
    { _id },
    {
      $addToSet: {
        talking: targetId,
      },
    },
  )
    .then(() => {
      res.send({ status: 0 });
    })
    .catch(() => {
      res.send({ status: 1, errMsg: '添加失败' });
    });
});

router.get('/test', (req, res) => {
  res.send('test');
  // const lasia = {
  //   name: 'sia',
  //   account: '18075083007@163.com',
  //   password: 'c5c3cec46d54a5db2dfe0a0fc10edb4c',
  //   isOnline: true,
  // };
  // User.create(lasia).then((log) => {
  //   console.log(log);
  // });

  // User.updateOne(
  //   { _id: '60d7534993947d0d70a2fd32' },
  //   {
  //     $pull: {
  //       talking: '60d990af5ca36104b00cb271',
  //     },
  //   },
  // ).then((res) => {
  //   console.log(res);
  // });
  // const code = {
  //   code: invitation(6),
  // };
  // InviteCode.create(code).then((data) => {
  //   console.log(data);
  // });

  // invitation(8);

  // InviteCode.findOne({}).sort({ _id: -1 }).limit(1).then((data) => {
  //   console.log(data);
  // });

  User.updateOne({ _id: '60d990af5ca36104b00cb271' }, {
    $set: { isOnline: true },
  }).then((res) => {
    console.log(res);
  });

  // User.updateMany({ }, {
  //   $set: { studentId: '1211' },
  // }, { multi: true, upsert: false }, (err, doc) => {
  //   if (!err) {
  //     console.log(doc);
  //   }
  // });
});

router.post('/fetchInvitationCode', (req, res) => {
  const { _id, password } = req.body;
  User.findById(_id).then((data) => {
    if (data.password === password && data.role === 'Administrator') {
      InviteCode.findOne({}).sort({ _id: -1 }).limit(1).then((code) => {
        res.send({ status: 0, code: code.code });
      });
    }
  });
});

router.post('/regenerateInvitationCode', (req, res) => {
  const { _id, password } = req.body;
  User.findById(_id).then((data) => {
    if (password === data.password && data.role === 'Administrator') {
      const code = invitation(6);
      InviteCode.findOne({}).sort({ _id: -1 }).limit(1).then((doc) => {
        InviteCode.updateOne({ _id: doc._id }, { status: 2 }).then(() => {
          InviteCode.create({ code }).then((newCode) => [
            res.send({ status: 0, code: newCode.code }),
          ]);
        });
      })
        .catch(() => {
          res.send({ status: 2, errMsg: '服务器错误' });
        });
    } else {
      res.send({ status: 1, errMsg: '无权限' });
    }
  });
});

router.post('/saveUserProfile', async (req, res) => {
  const { _id, token } = req.body;
  const { avatar, name, realName, grade, studentId, onlineStatus, collage, major } = req.body;
  const check = await Tools.tokenCheck(_id, token);
  if (check) {
    User.updateOne({ _id }, {
      avatar, name, realName, grade, studentId, onlineStatus, collage, major,
    }).then(() => {
      res.send({ status: 0, errMsg: '更新成功' });
    }).catch(() => {
      res.send({ status: 2, errMsg: '服务器错误' });
    });
  } else {
    res.send({ status: 1, errMsg: '身份信息有误' });
  }
});

module.exports = router;
