import Vue from 'vue'
import App from './App.vue'

import './assets/scss/style.scss'
import router from './router'

router.afterEach((to, from, next) => { // 跳转新页面的时候新页面在顶部位置
  window.scrollTo(0, 0)
});

import VueAwesomeSwiper from 'vue-awesome-swiper' // 使用 vue-awesome-swiper 插件做轮播图
// require styles
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import './assets/iconfont/iconfont.css' //引入字体图标

import { VueEditor } from "vue2-editor";
Vue.use(VueEditor)

import VideoCard from './components/VideoCard'
Vue.component('m-video-card', VideoCard)

import MainSwiper from './components/MainSwiper'
Vue.component('m-main-swiper', MainSwiper)

import Cover from './components/Cover'
Vue.component('m-cover', Cover)


import VueLazyload from 'vue-lazyload'
import error from './assets/images/failed.jpg'
import load from './assets/images/load.gif'

import vant from 'vant';
Vue.use(vant);

// 使用VueLazyload并传入相应的配置
Vue.use(VueLazyload, {
  preLoad: 1.3, // 提前加载高度（数字 1 表示 1 屏的高度） 默认值:1.3
  error: error, // 当加载图片失败的时候
  loading: load , // 图片加载状态下显示的图片
  attempt: 3 //  加载错误后最大尝试次数 默认值:3
})

import axios from 'axios'
Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/web/api'
  // baseURL: 'http://localhost:3000/web/api'
})

import store from './vuex/store'

import './utils/directive.js' // 自定义指令，解决ios12键盘弹出页面底部留白

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
