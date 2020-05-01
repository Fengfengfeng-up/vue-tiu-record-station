const mongoose = require('mongoose')

// 用户
const schema = new mongoose.Schema({
  username: { type: String }, 
  password: {
    type: String, 
    select: false, // false 前端不能查出密码
    set(val) {
      return require('bcrypt').hashSync(val, 10) 
    }
  },
  name: { type: String }, // 昵称
  avatar: { type: String },  // 头像
  school: { type: String },
  college: { type: String },
  grade: { type: String },
  sign: { type: String }
})

module.exports = mongoose.model('User', schema, 'users')