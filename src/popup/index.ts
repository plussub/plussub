import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './home.vue';
import HomeToolbar from './homeToolbar.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faUpload, faCog} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './app.vue';

Vue.use(Vuetify);
Vue.use(VueRouter);

library.add(faSearch, faUpload, faCog)
Vue.component('font-awesome-icon', FontAwesomeIcon)

const routes = [
  {
    path: '/home',
    name: 'home',
    components: {
      toolbar: HomeToolbar,
      content: Home
    }
  }
  // {path: '/search', name: 'search', component: Search},
  // {path: '/file', name: 'file', component: File},
];

const router = new VueRouter({ routes });

new Vue({
  router,
  render(createElement) {
    return createElement(App);
  },
  vuetify: new Vuetify({
    icons: {
      iconfont: 'fa'
    },
    theme: {
      themes: {
        light: {
          primary: '#5BC0DE',
          onPrimary: '#FFFFFF',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c',
          debug: '#b710af'
        }
      }
    }
  })
}).$mount('body');
