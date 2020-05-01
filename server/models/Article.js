const mongoose = require('mongoose')

// 文章
const schema = new mongoose.Schema({
  title: { type: String }, // 标题
  author: { type: String }, // 作者、来源
  category_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }, // 所属类型
  category_name: [{ type: String }], // 分类名
  body: { type: String }, // 内容
  like: { type: Number }, // 点赞数
  pageview: { type: Number }, // 浏览量
  isPicked: { type: Boolean }, // 当前是否被点赞
  comments: [{  // 评论
    content: { type: String }, // 内容
    date: { type: String }, // 时间
  }], 
  date: { type: String }, // 收录日期
}, {
  timestamps: true // 带上时间戳
})

module.exports = mongoose.model('Article', schema)