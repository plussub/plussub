/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/home/Home.vue';
import Search from '@/search/Search.vue';
import SubtitleSelection from '@/subtitleSelection/SubtitleSelection.vue';
import FilePick from '@/filepick/FilePick.vue';
import 'typeface-roboto';
import 'typeface-rubik';

import App from './App.vue';

import 'knopf.css';
import '@fortawesome/fontawesome-free/js/all';

const routerHistory = createWebHistory();

// @ts-expect-error  because dont know why not match
const app = createApp(App);

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/home',
      name: 'home',
      // @ts-expect-error because dont know why not match
      component: Home,
      props: true
    },
    {
      path: '/search',
      name: 'search',
      // @ts-expect-error  because dont know why not match
      component: Search,
      props: true
    },
    {
      path: '/subtitle-selection/:tmdb_id/:media_type',
      name: 'subtitleSelection',
      // @ts-expect-error because dont know why not match
      component: SubtitleSelection,
      props: true
    },
    {
      path: '/filepick',
      name: 'filepick',
      // @ts-expect-error  because dont know why not match
      component: FilePick,
      props: true
    }
  ]
});
app.use(router);
// router.isReady().then(() => app.mount('#app'))
app.mount('body');
router.replace({ name: 'home' });
