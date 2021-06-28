const express = require('express');

const router = express.Router();
const { QiNiu } = require('../engine');
const Mongo = require('../utils/Mongo');
const invitation = require('../utils/Invitation');

const { User } = Mongo;

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res) => {
  const { account, password } = req.body;
  User.findOne({ account }, (err, doc) => {
    // status 状态有三种 0：登陆成功，1：密码错误，2：账号不存在，3：服务器出错
    if (doc) {
      if (doc.password === password) {
        const token = invitation(32);
        User.updateOne({ _id: doc._id }, { token, tokenCreate: new Date().valueOf() }, (newErr) => {
          if (!newErr) {
            res.send({ status: 0, token, _id: doc._id, errMsg: '登陆成功' });
          } else {
            res.send({ status: 3, errMsg: '服务器错误' });
          }
        });
      } else {
        res.send({ status: 1, errMsg: '密码错误' });
      }
    } else {
      res.send({ status: 2, errMsg: '账号不存在' });
    }
    User.find({ account }, (err, doc) => {
      console.log(doc);
    });
  });
});

router.post('/register', (req, res) => {
  const { account, password, name, code } = req.body;
  if (code !== 'aaaaaaaa') {
    res.send({ status: 3, errMsg: '邀请码错误或已被使用' });
    return;
  }
  User.findOne({ account }, (err, doc) => {
    // status 状态有四种 0：创建成功，1：创建失败（一般为数据库内部错误），2：邮箱已被注册，3：邀请码错误或已被使用
    if (doc) {
      res.send({ status: 2, errMsg: '邮箱已被注册' });
    } else {
      const data = { account, password, name };
      User.create(data, (err) => {
        if (err) {
          res.send({ status: 1, errMsg: '创建失败' });
          return;
        }
        res.send({ status: 0, errMsg: '创建成功' });
      });
    }
  });
});

router.post('/checkUserToken', (req, res) => {
  console.log(req.body);
  const { _id, token } = req.body;
  const queryTime = new Date().valueOf();
  User.findById(_id, (err, doc) => {
    console.log('toke', doc);
    if (!err) {
      if (token === doc.token && queryTime - doc.tokenCreate <= 60 * 60 * 24 * 3) {
        const token = invitation(32);
        User.updateOne({ _id }, { token, tokenCreate: new Date().valueOf() }, () => {
          res.send({ status: 0, errMsg: '身份验证通过', token, _id });
        });
      } else {
        res.send({ status: 1, errMsg: '身份已失效' });
        const token = invitation(32);
        User.updateOne({ _id }, { token, tokenCreate: new Date().valueOf() });
      }
    } else {
      res.send({ status: 2, errMsg: '未知错误' });
    }
  });
});

router.get('/searchUserAndRoom', (req, res) => {
  const { key } = req.query;
  User.find({
    name: { $regex: key, $options: 'i' },
  }).then((data) => {
    res.send(data);
  });
});

router.get('/token', (req, res) => {
  const token = QiNiu.getToken();
  res.send(token);
});

module.exports = router;
