import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/home/Home.vue';
import Search from '@/search/Search.vue';
import SubtitleSelection from '@/subtitleSelection/SubtitleSelection.vue';
import FilePick from '@/filepick/FilePick.vue';
import "typeface-roboto";
import "typeface-rubik";

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
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      // @ts-expect-error
      component: Search,
      props: true
    },
    {
      path: '/subtitle-selection/:tmdbId/:mediaType',
      name: 'subtitleSelection',
      // @ts-expect-error
      component: SubtitleSelection,
      props: true
    },
    {
      path: '/filepick',
      name: 'filepick',
      // @ts-expect-error
      component: FilePick
    }
  ]
});

app.use(router);
router.push('home');

app.mount('body');
