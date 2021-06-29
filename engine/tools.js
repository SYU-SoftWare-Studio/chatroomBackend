const Mongo = require('../utils/Mongo');

const { User } = Mongo;

class Tools {
  static async tokenCheck(_id, token) {
    const queryTime = new Date().valueOf();
    const res = await User.findById(_id);
    if (token === res.token && queryTime - res.tokenCreate <= 60 * 60 * 24 * 3 * 1000) {
      return true;
    }
    return false;
    // User.findById(_id).then((res) => {
    //   if (token === res.token && queryTime - res.tokenCreate <= 60 * 60 * 24 * 3 * 1000) {
    //     return true;
    //   }
    //   return false;
    // }).catch(() => {
    //   return false;
    // });
  }
}

module.exports = Tools;
