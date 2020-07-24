<template>
  <div class="app--container">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script>
export default {
  setup() {}
};
</script>

<style>
:root {
  --primary: #5bc0de;
  --onPrimary: #ffffff;
  --on-surface: var(--default-text-color);
  --secondary: #b0bec5;
  --accent: #8c9eff;
  --error: #b71c1c;
  --debug: #b710af;
  --background-color: white;
  --surface-color: white;
  --default-text-color: #989898;
  --default-header-text-color: #000000;

  --toolbar-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --toolbar-height: 40px;
  --content-lr-space: 8px;

  --card-padding-top: 16px;
  --card-header-font-size: 1.4em;
  --card-header-font-family: 'Rubik', sans-serif;
  --card-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  --card-lr-space: 16px;

  font-size: 18pt;
}

body {
  --knopf-hue: 194;
  --knopf-saturation: 66.5%;
  --knopf-luminosity: 61.4%;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  color: var(--default-text-color);
}

.buttonOnPrimary {
  --knopf-text-color: --onPrimary;
  --knopf-hue: 0;
  --knopf-saturation: 0%;
  --knopf-luminosity: 100%;
}

.content-navigate-deeper-enter-active {
  transition: all 0.1s ease;
}
.content-navigate-deeper-leave-active {
  transition: all 0.1s ease;
}
.content-navigate-deeper-enter-from,
.content-navigate-deeper-leave-to {
  transform: scale3d(.3, .3, .3);
  opacity: 0;
}

.content-navigate-shallow-enter-active {
  opacity: 1;
  transition: all 0.1s ease;
}
.content-navigate-shallow-leave-active {
  transition: all 0.1s ease;
}
.content-navigate-shallow-enter-from,
.content-navigate-shallow-leave-to {
  transform: scale3d(1.3, 1.3, 1.3);
  opacity: 0;
}
</style>

<style scoped>
.app--container {
  max-width: 400px;
  width: 400px;
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: hidden;
  display: grid;
  grid-template-areas:
    'toolbar'
    'content';
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
}
</style>
