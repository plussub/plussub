//todo: use ../js/nodemodules/vue ?

import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Redux from 'redux';
import ReduxConfig from './redux_config/slave.js'
import OptionRouter from './option_router.vue';
import Subtitle from '../core/option/subtitle.vue';
import Debug from '../core/option/debug.vue';
import Factory from '../core/option/factory.vue';

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
    {path: '/subtitle', name: 'home', component: Subtitle},
    {path: '/debug', name: 'debug', component: Debug},
    {path: '/factory', name: 'factory', component: Factory}

];

const router = new VueRouter({routes});

new Vue({
    router,
    render(createElement) {
        return createElement(OptionRouter)
    }
}).$mount('#app');
