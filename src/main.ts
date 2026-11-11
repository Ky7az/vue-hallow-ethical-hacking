import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp, h } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';
import VueHotkey from 'v-hotkey3';
import VueTimeago from 'vue-timeago3';

const app = createApp({
    render: () => h(App),
});

app.use(router);
app.use(store, key);
app.use(VueHotkey);

const timeagoOptions = {
    converterOptions: {
        includeSeconds: false,
    },
};
app.use(VueTimeago, timeagoOptions);

app.mount('#app');
