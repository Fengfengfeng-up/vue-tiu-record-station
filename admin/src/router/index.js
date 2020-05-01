import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/main/Main.vue'
import Login from '../views/main/Login.vue'

import AdminUserEdit from '../views/user/AdminUserEdit.vue'
import AdminUserList from '../views/user/AdminUserList.vue'

import CategoryEdit from '../views/category/CategoryEdit.vue'
import CategoryList from '../views/category/CategoryList.vue'

import AdEdit from '../views/material/AdEdit.vue'
import AdList from '../views/material/AdList.vue'

import ArticleEdit from '../views/material/ArticleEdit.vue'
import ArticleList from '../views/material/ArticleList.vue'

import ImageEdit from '../views/material/ImageEdit.vue'
import ImageList from '../views/material/ImageList.vue'

import PictureEdit from '../views/material/PictureEdit.vue'
import PictureList from '../views/material/PictureList.vue'

import CommentList from '../views/response/CommentList.vue'

import UserList from '../views/user/UserList.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { isPublic: true } },
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      { path: '/categories/create', component: CategoryEdit },
      { path: '/categories/edit/:id', component: CategoryEdit, props: true },
      { path: '/categories/list', component: CategoryList },

      { path: '/admin_users/create', component: AdminUserEdit },
      { path: '/admin_users/edit/:id', component: AdminUserEdit, props: true },
      { path: '/admin_users/list', component: AdminUserList },

      { path: '/articles/create', component: ArticleEdit },
      { path: '/articles/edit/:id', component: ArticleEdit, props: true },
      { path: '/articles/list', component: ArticleList },

      { path: '/ads/create', component: AdEdit },
      { path: '/ads/edit/:id', component: AdEdit, props: true },
      { path: '/ads/list', component: AdList },

      { path: '/images/create', component: ImageEdit },
      { path: '/images/edit/:id', component: ImageEdit, props: true },
      { path: '/images/list', component: ImageList },
      
      { path: '/pictures/create', component: PictureEdit },
      { path: '/pictures/edit/:id', component: PictureEdit, props: true },
      { path: '/pictures/list', component: PictureList },

      { path: '/comments/list', component: CommentList },

      { path: '/users/list', component: UserList },

    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !localStorage.token) { 
    return next('/login')
  }
  next()
})

export default router
