//todo: use ../js/nodemodules/vue ?

import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import ReduxConfig from './redux_config/slave.js'
import PopupRouter from './popup_router.vue';
import openOptionPageEventHandler from './eventhandler/openOptionPage.js';

import Home from '../core/app/home.vue';
import Search from '../core/app/search.vue';
import File from '../core/app/file.vue';

Vue.use(Vuetify, {
    theme: {
        primary: '#5BC0DE',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
        debug: '#b710af'
    }
});
Vue.use(VueRouter);

const routes = [
    {path: '/home', name: 'home', component: Home},
    {path: '/search', name: 'search', component: Search},
    {path: '/file', name: 'file', component: File},
];

const router = new VueRouter({routes});

new Vue({
    router,
    render(createElement) {
        return createElement(PopupRouter)
    }
}).$mount('#app');
