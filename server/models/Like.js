const mongoose = require('mongoose')

// 点赞
const schema = new mongoose.Schema({
  // user_id: { type: String }, // 点赞的用户
  id: { type: String }, // id
  type: { type: String }, // 类型
  status: { type: Boolean },  // 是否点赞
})

module.exports = mongoose.model('Like', schema, 'likes')