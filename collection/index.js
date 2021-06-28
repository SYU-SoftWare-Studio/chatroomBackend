const mongoose = require('mongoose');

class Collection {
  static User() {
    return new mongoose.Schema({
      avatar: { type: String, default: '' },
      name: { type: String, default: '' },
      realName: { type: String, default: '' },
      gender: { type: String, default: '' },
      talking: Array,
      public: Array,
      private: Array,
      isOnline: { type: Boolean, default: false },
      collage: { type: String, default: '' },
      onlineStatus: { type: String, default: '' },
      major: { type: String, default: '' },
      grade: { type: Number, default: null },
      age: { type: Number, default: null },
      account: { type: String, default: '' },
      password: { type: String, default: '' },
      role: { type: String, default: '' },
      createTime: { type: Number, default: new Date().valueOf() },
      token: { type: String, default: '' },
      tokenCreate: { type: Number, default: null },
      studentId: { type: String, default: '' },
    });
  }

  static PublicChatRoom() {
    return new mongoose.Schema({
      avatar: { type: String },
      name: { type: String },
      createTime: { type: Number },
      creatorId: { type: String },
      member: Array,
      describe: { type: String },
      recordId: { type: String },
    });
  }
}

module.exports = Collection;
