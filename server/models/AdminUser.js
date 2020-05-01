const mongoose = require('mongoose')

// 后台管理员
const schema = new mongoose.Schema({
  username: { type: String }, 
  password: {
    type: String, 
    select: false, // false 前端不能查出密码
    set(val) {
      return require('bcrypt').hashSync(val, 10) // 使用 bcrypt 将用户密码散列加密,目前常用的一种加密方式
    }
  },
  name: { type: String }, // 用户名
  role: { type: String } 
})

module.exports = mongoose.model('AdminUser', schema)