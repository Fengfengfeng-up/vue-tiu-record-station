import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import Photo from '../views/Photo.vue'
import PhotoDetail from '../views/PhotoDetail.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import Article from '../views/Article.vue'
import Comment from '../views/Comment.vue'
import CommentWrite from '../views/CommentWrite.vue'
import None from '../views/None.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      { path: '/', name: 'home', component: Home, meta: { keepAlive: true } },

      { path: '/articles/:category', name: 'articles', component: Article, props: true, meta: { keepAlive: true } },

      { path: '/articles/:category/:id', name: 'article-detail', component: ArticleDetail, props: true, meta: { keepAlive: true } },

      { path: '/photos/:category', name: 'photos', component: Photo, props: true, meta: { keepAlive: true } },

      { path: '/photos/:category/:id', name: 'photo-detail', component: PhotoDetail, props: true },

      { path: '/comments', name: 'comments', component: Comment},

      {
        path: '/comments/write', component: CommentWrite, children: [
          { path: '/comments/write/:id', name: 'comments-check', component: CommentWrite },
        ]
      }
    ]
  },
  

  { path: '*', component: None },

]



const router = new VueRouter({
  routes
})

export default router
