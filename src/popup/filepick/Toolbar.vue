<template>
  <div style="background-color: var(--primary); color: var(--onPrimary); width: 100%; height: 40px; box-shadow: var(--toolbar-shadow); display: flex;">
    <toolbar-back-to-home style="height: 100%;" />

    <div style="align-self: center; flex-grow: 1; display: flex; margin-left: 16px;">
      Pick a file
    </div>
  </div>
</template>

<script>
import ToolbarBackToHome from '@/components/ToolbarBackToHome.vue';

export default {
  components: {
    ToolbarBackToHome
  }
};
</script>
