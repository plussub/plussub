<template>
  <PageLayout>
    <template #toolbar>
      <Toolbar/>
    </template>
    <template #content>
      <div class="flex h-full items-center justify-center">
        <FontAwesomeIcon icon="circle-notch" class="h-icon-lg animate-spin text-primary-500"/>
      </div>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageLayout from '@/components/PageLayout.vue';
import FontAwesomeIcon from '@/components/FontAwesomeIcon/FontAwesomeIcon.vue';
import Toolbar from '@/toolbar/Toolbar.vue';

export default defineComponent({
  components: {
    PageLayout,
    FontAwesomeIcon,
    Toolbar
  }
});
</script>