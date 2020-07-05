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

<template>
  <v-app style="width: 400px; height: 400px;">
    <v-container>
      <router-view class="toolbar" name="toolbar" />
      <transition name="fade" mode="out-in">
        <router-view class="content" name="content" />
      </transition>
    </v-container>
  </v-app>
</template>

<script>
export default {
  created() {
    this.$router.push('/home');
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
}
</style>
