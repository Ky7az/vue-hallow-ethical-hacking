import { createStore } from 'vuex'
import soup from './modules/soup'
import watch from './modules/watch'
import pentest from './modules/pentest'
import writeup from './modules/writeup'


const store = createStore({
    modules: {
        soup,
        watch,
        pentest,
        writeup
    },
    strict: true
})

export default store;
