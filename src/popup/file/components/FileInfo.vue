<template>
  <div>
    filename: {{filename}}
  </div>
</template>

<script lang="ts">

import {defineComponent, inject} from "vue";
import {FileStore} from "@/file/store";

export default defineComponent({
  setup(){
    const fileStore = inject<FileStore>('fileStore');
    if (!fileStore) {
      throw new Error('inject failed');
    }
    return {
      filename: fileStore.state.value.filename
    }
  }
});
</script>
