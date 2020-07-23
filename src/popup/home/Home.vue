<template>
  <div class="home-toolbar--container toolbar">
    <transition name="toolbar-transition" appear>
      <div class="home-toolbar--container--content">
        <img :src="logo" alt="logo" style="grid-area: logo; height: 100%; width: 100%; object-fit: contain;" />
        <div style="grid-area: buttons; display: flex; justify-content: flex-end;">
          <a class="knopf flat pill small buttonOnPrimary" @click="this.$router.replace({ name: 'search', params: { showContentAnimation: 'content-navigate-deeper'} })"><i class="fa fa-search fa-lg"></i></a>
          <a class="knopf flat pill small buttonOnPrimary" @click="this.$router.replace({ name: 'filepick', params: { showContentAnimation: 'content-navigate-deeper'} })"><i class="fa fa-upload fa-lg"></i></a>
          <a class="knopf flat pill small buttonOnPrimary" @click="openOptionPage"><i class="fa fa-cog fa-lg"></i></a>
        </div>
      </div>
    </transition>
  </div>

  <transition :name="props.showContentAnimation" appear>
    <div class="home-content--container content">
      <transition name="fade" appear>
        <div v-if="state.contentExists" class="home-content--current-sub--container--card" style="grid-area: current-sub;">
          <div style="grid-area: card-header; position: relative;">
            <div class="home-content--current-sub--container--card--hero">
              <img src="https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" style="max-height: var(--image-height); height: 100%; width: 100%; object-fit: cover;" />
            </div>
            <div style="position: absolute; color: white; top: 8px; left: 16px; width: calc(100% - 32px);">
              <div style="font-family: var(--card-header-font-family); width: 100%; display: flex; justify-content: space-between;">
                <span>
                  <span style="font-size: var(--card-header-font-size);">
                    Pulp Fiction
                  </span>
                  <span style="font-size: 0.75em;">
                    (1994-09-10)
                  </span>
                </span>
                <span style="align-self: flex-end;">
                  <i class="fa fa-spinner"></i>
                </span>
              </div>
              <div style="font-size: 0.75em; margin-top: 16px; line-height: 1.6;">
                <div>
                  imdb: 8,7
                </div>
                <div>
                  subRating: 7
                </div>
                <div>
                  subLang: English
                </div>
              </div>
            </div>
          </div>
          <div style="grid-area: card-content; display: flex; width: 100%; font-size: 0.75em; line-height: 1.6;">
            A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three
            stories that ingeniously trip back and forth in time.
          </div>
          <div style="grid-area: card-divider; align-self: end;">
            <divider />
          </div>
          <div style="grid-area: card-action; justify-self: end;">
            <a class="knopf flat block end small" style="width: 100%;">More Info</a>
            <a class="knopf flat block end small" style="width: 100%;" @click="removeSubtitle">Remove subtitle</a>
            <a class="knopf flat block end small" style="width: 100%;">Select another subtitle</a>
          </div>
        </div>
        <div v-else class="home-content--no-sub--container--card" style="grid-area: current-sub;">
          <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
            No subtitle selected
          </div>
          <div style="grid-area: card-content; width: 100%; font-size: 0.75em; line-height: 1.6; margin-bottom: 16px;">
            <div style="width: 100%;">Hi, you currently have no subtitle selected.</div>
            <div style="width: 100%;">To search subtitle online use <i class="fa fa-search fa-sm"></i>.</div>
            <div style="width: 100%;">If you want to load a subtitle file use <i class="fa fa-upload fa-sm"></i>.</div>
          </div>
        </div>
      </transition>
      <div class="home-content--offset--container--card" style="grid-area: offset;">
        <div style="grid-area: card-header; font-family: var(--card-header-font-family); font-size: var(--card-header-font-size); color: var(--default-header-text-color);">
          Subtitle offset setting
        </div>
        <div style="grid-area: card-content; display: flex; width: 100%;">
          <div>
            <span style="font-size: 0.8em;">Actual</span>
            <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" value="0" type="text" disabled />
          </div>
          <div>
            <span style="font-size: 0.8em;">New</span>
            <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" type="text" />
          </div>
        </div>
        <div style="grid-area: card-divider; align-self: end;">
          <divider />
        </div>
        <div style="grid-area: card-action; justify-self: end;">
          <a class="knopf flat small">Apply</a>
          <a class="knopf flat small">Reset</a>
        </div>
      </div>

      <div style="grid-area: spacer;">&nbsp;</div>
    </div>
  </transition>
</template>

<script>
import logo from '@/res/plussub128.png';
import { openOptionPage } from 'openOptionPage';
import { reactive } from 'vue';
import Divider from '@/components/Divider';

export default {
  components: {
    Divider
  },
  props: {
    showContentAnimation: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const state = reactive({ contentExists: true });
    return {
      props,
      logo,
      openOptionPage,
      state,
      removeSubtitle: () => {
        state.contentExists = false;
      }
    };
  }
};
</script>

<style scoped>
.home-toolbar--container {
  background-color: var(--primary);
  color: var(--onPrimary);
  width: 100%;
  height: 100%;
}

.home-toolbar--container--content {
  box-shadow: var(--toolbar-shadow);
  display: grid;
  grid-template-areas: 'logo buttons .';
  grid-template-rows: 40px;
  grid-template-columns: 64px 1fr 16px;
}

.home-content--container {
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-areas:
    '. current-sub .'
    '. offset .'
    '. spacer .';
  grid-template-rows: auto auto auto;
  grid-template-columns: var(--content-lr-space) 1fr var(--content-lr-space);
  row-gap: 16px;
}

.home-content--no-sub--container--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. card-header .'
    '. . .'
    '. card-content .';
  grid-template-rows: auto 16px 1fr;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}

.home-content--current-sub--container--card {
  --image-height: 120px;
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  grid-template-areas:
    'card-header card-header card-header'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: var(--image-height) 16px 1fr 16px auto;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}

.home-content--current-sub--container--card--hero::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.62);
  opacity: 1;
}

.home-content--offset--container--card {
  background-color: var(--surface-color);
  box-shadow: var(--card-shadow);
  display: grid;
  padding-top: var(--card-padding-top);
  grid-template-areas:
    '. card-header .'
    '. . .'
    '. card-content .'
    'card-divider card-divider card-divider'
    '. card-action .';
  grid-template-rows: auto 16px 1fr 16px auto;
  grid-template-columns: var(--card-lr-space) 1fr var(--card-lr-space);
  width: 100%;
}
</style>
