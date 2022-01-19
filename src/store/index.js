import Vue from 'vue'
import Vuex from 'vuex'
import soup from './modules/soup'
import pentest from './modules/pentest'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        soup,
        pentest
    },
    strict: true
})