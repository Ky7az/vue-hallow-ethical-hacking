import Vue from 'vue'
import Vuex from 'vuex'
import soup from './modules/soup'
import watch from './modules/watch'
import pentest from './modules/pentest'
import writeup from './modules/writeup'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        soup,
        watch,
        pentest,
        writeup
    },
    strict: true
})