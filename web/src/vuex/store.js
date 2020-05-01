import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    load: false,
    cover: false
  },
  mutations: {
    onLoading(state) {
      state.load = !state.load
    },
    onCover(state) {
      state.cover = !state.cover
    }
  }
})