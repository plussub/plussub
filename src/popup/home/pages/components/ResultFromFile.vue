<template>
  <div class="relative bg-surface-50 grid w-full rounded-lg shadow-lg border border-primary-700 result-from-file--card">
    <div class="absolute flex font-medium top-2.5	right-2.5">
      <div class="text-xs mr-1">{{ prettyState }}</div>
      <div class="text-xs flex align-center">
        <transition name="fade" mode="out-in">
          <Spinner v-if="state !== 'DONE'" />
          <fa v-else icon="check" class="h-icon-sm" />
        </transition>
      </div>
    </div>
    <div class="font-header font-medium text-2xl flex mt-2 px-2" style="grid-area: header;">
      <div>Subtitle via file</div>
    </div>
    <div class="w-full text-sm px-4" style="grid-area: details;">
      <span class="font-medium">Filename</span>
      <span class="one-line">{{ fileState.filename }}</span>
    </div>
    <div class="px-4" style="grid-area: settings">
      <slot name="settings" />
    </div>
    <div class="justify-self-end self-center px-4" style="grid-area: actions;">
      <a class="w-full text-primary-500 hover:text-primary-700" @click="$emit('remove')">Remove subtitle</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, UnwrapRef, computed } from 'vue';
import { capitalizeFirst } from '@/util/string';
import { FileState } from '@/file/state/types';
import { default as Spinner } from '@/components/Spinner.vue';

export default defineComponent({
  components: {
    Spinner
  },
  props: {
    state: {
      type: String as PropType<string>,
      required: true
    },
    fileState: {
      type: Object as PropType<UnwrapRef<FileState>>,
      required: true
    }
  },
  emits: ['remove'],
  setup(props) {
    return {
      prettyState: computed(() => capitalizeFirst(props.state))
    };
  }
});
</script>

<style scoped>

.result-from-file--card {
  grid-template-areas:
    'header  '
    '.       '
    'details '
    '.       '
    'settings'
    '.       '
    '.       '
    'actions '
    '.       ';
  grid-template-rows: auto 16px auto 16px auto 16px 8px 50px 8px;
  grid-template-columns: 1fr;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 1;
}
</style>
