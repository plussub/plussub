<template>
  <v-app-bar app style="color: var(--onPrimary);" color="primary" dense>
    <v-toolbar-title class="text-subtitle-1" style="">
      <v-avatar>
        <img :src="logo" />
      </v-avatar>
    </v-toolbar-title>
    <v-spacer />
    <v-btn color="onPrimary" icon>
      <font-awesome-icon icon="search" size="lg"/>
    </v-btn>
    <v-btn color="onPrimary" icon>
      <font-awesome-icon icon="upload" size="lg"/>
    </v-btn>
    <v-btn color="onPrimary" icon>
      <font-awesome-icon icon="cog" size="lg"/>
    </v-btn>
  </v-app-bar>
</template>

<script>
import logo from './res/plussub128.png';

export default {
  data() {
    return {
      logo
    };
  }
};
</script>

<style></style>
