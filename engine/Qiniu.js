const NodeCache = require('node-cache');
const qiniuSDK = require('qiniu');

const QiNiuCache = new NodeCache({ stdTTL: 0, checkperiod: 300 });

const setting = {
  accessKey: '6fZ85WHeIXpIFZUzyJkFk9IF9k-ARx-_GhOckYjK',
  secretKey: 'g8GtJ6xXkwgy-0ufT4cV8CcORwC5rpsUbR3tQh4n',
  bucket: 'syu-studio-chatroom',
};

class QiNiu {
  static isTokenEffective() {
    if (QiNiuCache.get('token')) {
      return true;
    }
    return false;
  }

  static fetchToken() {
    console.log('fetchtoken');
    const { accessKey, secretKey, bucket } = setting;
    const mac = new qiniuSDK.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: bucket,
      expires: 3600 * 2,
    };

    const putPolicy = new qiniuSDK.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac);

    QiNiuCache.set('token', token, 3600 * 1.5);
    return token;
  }

  static getToken() {
    if (this.isTokenEffective()) {
      console.log('already have');
      return QiNiuCache.get('token');
    }
    console.log('don have');
    return this.fetchToken();
  }
}

module.exports = QiNiu;
