const mongoose = require('mongoose')

// 工作室图片
const schema = new mongoose.Schema({
  categories_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],  // 图片类型
  categories_name: [{ type: String }],
  title: { type: String }, // 名称
  items: [{ // 图片
    img: { type: String },
    isPicked: { type: Boolean }, // 当前是否被点赞
  }],
  author: { type: String }, // 作者
  date: { type: String }, // 拍摄日期
  location: { type: String }, // 拍摄位置
  desc: { type: String }, // 描述
  like: { type: Number }, // 点赞数
  article_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'Article' }, // 对应的文章
  article_title: { type: String }
}, {
  timestamps: true // 上传日期
})

module.exports = mongoose.model('Picture', schema, 'pictures')