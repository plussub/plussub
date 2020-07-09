import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/home/Content.vue';
import HomeToolbar from '@/home/Toolbar.vue';
import Search from '@/search/Content.vue';
import SearchToolbar from '@/search/Toolbar.vue';
import Filepick from '@/filepick/Content.vue';
import FilepickToolbar from '@/filepick/Toolbar.vue';

import App from './App.vue';

import 'knopf.css';
import '@fortawesome/fontawesome-free/js/all';

const routerHistory = createWebHistory();

// @ts-expect-error
const app = createApp(App);

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/home',
      name: 'home',
      // @ts-expect-error
      components: {
        toolbar: HomeToolbar,
        content: Home
      }
    },
    {
      path: '/search',
      name: 'search',
      // @ts-expect-error
      components: {
        toolbar: SearchToolbar,
        content: Search
      }
    },
    {
      path: '/filepick',
      name: 'filepick',
      // @ts-expect-error
      components: {
        toolbar: FilepickToolbar,
        content: Filepick
      }
    }
  ]
});

app.use(router);
router.push('home');

app.mount('body');
