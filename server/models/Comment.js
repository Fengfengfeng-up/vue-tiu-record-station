const mongoose = require('mongoose')

// 留言板
const schema = new mongoose.Schema({
  content: { type: String }, // 内容
  date: { type: String }, // 时间
  // like: { type: Number }, // 点赞
  // isPicked: { type: Boolean }, // 当前是否被点赞
})

module.exports = mongoose.model('Comment', schema, 'comments')