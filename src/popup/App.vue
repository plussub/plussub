<template>
  <div style="max-width: 400px; width: 400px;">
    <router-view style="width: 100%;" name="toolbar" />
    <router-view name="content" v-slot="{ Component }" style="width: 100%; margin-top: 16px; margin-bottom: 16px">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  setup() {
  }
};
</script>

<style>
:root {
  --primary: #5bc0de;
  --onPrimary: #ffffff;
  --secondary: #b0bec5;
  --accent: #8c9eff;
  --error: #b71c1c;
  --debug: #b710af;

  --toolbar-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  font-size: 18pt;
}
  body {
    margin: 0;
  }
</style>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1s ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
