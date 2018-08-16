//todo: use ../js/nodemodules/vue ?
let Vue = require('vue');
let Vuetify = require('vuetify');

// let App = require('../js/node_modules/plussub-core/vue-app/app2.vue');
let App = require('./popup.vue');


Vue.use(Vuetify);

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App)
    }
});