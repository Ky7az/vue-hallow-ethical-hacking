import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import { enable as enableDarkMode } from 'darkreader'
import { TablePlugin } from 'bootstrap-vue'
import VueHotkey from 'v-hotkey'
import VueTimeago from 'vue-timeago'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(TablePlugin);
Vue.use(VueHotkey);
Vue.use(VueTimeago, {
    locale: 'fr',
    locales: {
      'fr-FR': require('date-fns/locale/fr')
    }
});
enableDarkMode();

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
