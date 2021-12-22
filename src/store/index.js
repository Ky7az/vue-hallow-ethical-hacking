import Vue from 'vue'
import Vuex from 'vuex'
import soup from './modules/soup'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        soup
    },
    strict: true
})