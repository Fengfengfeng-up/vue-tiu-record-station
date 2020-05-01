module.exports = app => {
  const router = require('express').Router()

  // 通过 mongoose 引用模型
  const mongoose = require('mongoose')
  const Category = mongoose.model('Category')
  const Article = mongoose.model('Article')
  const Ad = mongoose.model('Ad')
  const Image = mongoose.model('Image')
  const Picture = mongoose.model('Picture')
  const Comment = mongoose.model('Comment')
  const Like = mongoose.model('Like')
  // const Video = mongoose.model('Video')


  // 点赞
  router.post('/update/:category', async (req, res) => {
    let data

    if (req.params.category == 'home') { // 主页轮播图点赞
      data = await Ad.updateOne(
        { "items.title": req.body[0] },
        { $set: { "items.$.like": req.body[1] } }
      )
    } else if (req.params.category == 'photo') { // 图集点赞
      data = await Image.updateOne( // Image模型查找
        { "_id": req.body[0] },
        { $set: { "like": req.body[1] } }
      )

      if (data.nModified != 1) { // 找不到 Picture查找
        data = await Picture.updateOne(
          { "_id": req.body[0] },
          { $set: { "like": req.body[1] } }
        )
      }

    } else if (req.params.category == 'article') {
      data = await Article.updateOne( // Image模型查找
        { "_id": req.body[0] },
        { $set: { "like": req.body[1] } }
      )
    }

    res.send(data)

  })


  // 图片分类
  router.get('/category/:cat', async (req, res) => {
    let data = await Category.find()
    let newDta = []
    data = data.map(item => {
      if (item.parent == '5e6a2ab0f4acf719540500bd') {
        newDta.push(item.name)
      }
    })

    newDta = [[newDta[0], 'people'], [newDta[1], 'animal'], [newDta[2], 'black_white'], [newDta[3], 'view'], [newDta[4], 'others'],]

    res.send(newDta)
  })


  // 添加对应英文分类名
  function getEnglishCategory(data) {
    for (let i in data) {

      if (data[i].categories_name) {
        switch (data[i].categories_name[0]) {
          case '人像':
            data[i].categories_name[1] = 'people'
            break
          case '小动物':
            data[i].categories_name[1] = 'animal'
            break
          case '黑白':
            data[i].categories_name[1] = 'black_white'
            break
          case '风光':
            data[i].categories_name[1] = 'view'
            break
          case '其他':
            data[i].categories_name[1] = 'others'
            break
        }
      }

      if (data[i].category_name) {
        switch (data[i].category_name[0]) {
          case '学习':
            data[i].category_name[1] = 'study'
            break
          case '生活':
            data[i].category_name[1] = 'life'
            break
          case '情感':
            data[i].category_name[1] = 'emotion'
            break
          case '故事':
            data[i].category_name[1] = 'story'
            break
        }
      }
    }
    return data
  }


  // 主页轮播图
  router.get('/ads/list', async (req, res) => {
    const data = await Ad.find()
    const cat = data
    res.send(cat)
  })


  // 主页图集
  router.get('/mainphotos/list', async (req, res) => {
    const images = await Image.find()
    const pictures = await Picture.find()
    const data = images.concat(pictures).sort(() => Math.random() - 0.5).splice(0, 4)

    cat = getEnglishCategory(data)
    res.send(data)
  })


  // 图集页
  router.get('/photos/list/:index', async (req, res) => {
    const index = req.params.index
    const images = await Image.find()
    const pictures = await Picture.find()
    const data = images.concat(pictures)

    const human = []
    const animal = []
    const blackWhite = []
    const school = []
    const other = []
    data.map(item => {
      if (item.categories_name == '人像') {
        human.push(item)
      }
      if (item.categories_name == '小动物') {
        animal.push(item)
      }
      if (item.categories_name == '黑白') {
        blackWhite.push(item)
      }
      if (item.categories_name == '风光') {
        school.push(item)
      }
      if (item.categories_name == '其他') {
        other.push(item)
      }
    })

    const cat = [human, animal, blackWhite, school, other]
    let photos = []
    let size = 6
    if (index == 'category') { // 默认加载的 photos
      photos = cat.map(item => {
        let isEmpty;
        if (item.length > size) {
          isEmpty = false
        } else {
          isEmpty = true
        }

        item = item.slice(0, size)
        item.push(isEmpty)
        return item
      })
    } else {
      if (index.slice(1) == 0) { // 第一次加载更多
        let isEmpty = cat[index.slice(0, 1)].length > size * 2 ? false : true // 判断是否还有剩余 photo
        photos = cat[index.slice(0, 1)].splice(size, size)
        photos.push(isEmpty)
      } else { // 第二次加载更多
        photos = cat[index.slice(0, 1)].splice(size * 2)
        photos.push(true) // 没有剩余的photo了
      }
    }

    res.send(photos)
  })


  // 图片详情
  router.get('/photos/:category', async (req, res) => {
    const category = req.params.category
    const images = await Image.find()
    const pictures = await Picture.find()
    const cats = images.concat(pictures)
    let data = []
    getEnglishCategory(cats).map(item => {
      if (item.categories_name[1] == category) {
        data.push(item)
      }
    })

    res.send(data)
  })


  // 主页文章
  router.get('/mainarticles/list', async (req, res) => {

    let data = await Article.find()
    data = data.sort(() => Math.random() - 0.5).splice(0, 6)
    data = getEnglishCategory(data)

    res.send(data)
  })


  // 文章列表
  router.get('/articles/list', async (req, res) => {
    const parent = await Category.findOne().where({
      name: '文章'
    })
    let cats = await Category.aggregate([
      { $match: { parent: parent._id } }, // 找到文章下的子分类
      {
        $lookup: { // 关联查询
          from: 'articles',
          localField: '_id',
          foreignField: 'category_id',
          as: 'articleList',
        },
      }
    ])

    cats = cats.map(item => {
      item.articleList.splice(6)
      item.isEmpty = !(item.articleList.length >= 5) // 判断每个分类下是否还有每次上拉加载必需的数量
      return item
    })

    let data = cats.map(item => { // 只截取文章内容第一段文字
      item.articleList.map(a => {
        a.body = a.body.slice(a.body.indexOf('>') + 1, a.body.indexOf('</p>'))
        return a
      })
      return item
    })

    data = getEnglishCategory(data)

    res.send(data)
  })


  // 上拉加载更多文章
  router.get('/articles/more/:id', async (req, res) => {
    const cat = ['学习', '生活', '故事', '情感']
    const catName = [cat[req.params.id.slice(0, 1)]]
    const count = req.params.id.slice(1)

    const start = 6 // 每个分类默认已加载完数量
    const size = 5 // 每次加载数量

    let data = await Article.find().where({
      category_name: catName
    })

    let dataLength = data.slice(5).length // 未取之前的长度

    newData = data.slice(5).splice((count - 1) * size + 1, size).map(item => { // 只截取文章内容第一段文字
      item.body = item.body.slice(item.body.indexOf('>') + 1, item.body.indexOf('</p>'))
      return item
    })

    newData.push(dataLength - newData.length *  count) // 剩余长度

    res.send(newData)
  })


  // 文章详情
  router.get('/articles/list/:id', async (req, res) => {
    let data = await Article.findById(req.params.id).lean()

    if (data.comments && data.comments.length > 6) {
      data.comments = data.comments.reverse().splice(0, 6)
    }

    await Article.findByIdAndUpdate(req.params.id, { $inc: { 'pageview': '1' } }) // 浏览量

    const cat = data.category_id

    const related = await Article.find().where({
      category_id: { $in: [cat] }
    })

    let newRelated = []

    related.map(item => {
      if (item.title != data.title && item.body != data.body) {
        newRelated.push(item)
      }
    })

    data.related = newRelated.sort((a, b) => b.date.localeCompare(a.date)) // 按日期排序

    if (data.related.length > 6) {
      data.related.splice(6)
    }

    res.send(data)
  })

  // 文章评论
  router.post('/article/comment/:id', async (req, res) => {
    const id = req.params.id
    await Article.findByIdAndUpdate(id, { $push: { 'comments': req.body } })
    res.send('ok')
  })


  // 新留言
  router.post('/comment/submit', async (req, res) => {
    await Comment.create(req.body)
    res.send('successfully')
  })


  // 留言列表
  router.get('/comments/list/:id', async (req, res) => {
    const count = req.params.id // 次数
    const size = 6 // 每次传送的条数
    
    const all = await Comment.find()
    const me = all.splice(0, 3)
    const data = [...me, ...all.reverse()]

    let newData = data.splice((count - 1) * size, size)

    const leftLength = data.length - newData.length * count

    newData = [...newData, leftLength]

    res.send(newData)
  })


  // 留言详情
  router.get('/comments/:id', async (req, res) => {
    const data = await Comment.findOne().where({
      _id: req.params.id
    })

    res.send(data)
  })

  app.use('/web/api', router)
}