const mongoose = require('mongoose')

// 广告位图
const schema = new mongoose.Schema({
  name: { type: String },  // 名称
  items: [{  // 广告资源 
    image: { type: String }, // 图片
    title: { type: String }, // 标题
    desc: { type: String }, // 描述
    date: { type: String }, // 拍摄时间
    location: { type: String }, // 拍摄地点
    like: { type: Number },
    isPicked: { type: Boolean }, // 当前是否被点赞
  }]
})

module.exports = mongoose.model('Ad', schema)