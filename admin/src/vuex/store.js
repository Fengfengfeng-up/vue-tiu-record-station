import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const state = {
  adminUser: ''
}

const mutations = {
  getAdminUser(state, {name}) {
    this.state.adminUser = name
    console.log(name)
  } 
}

export default new Vuex.Store({
  state,
  mutations
})