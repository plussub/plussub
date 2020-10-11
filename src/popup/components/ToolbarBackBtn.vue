<template>
  <a class="knopf flat pill sharp buttonOnPrimary" @click="backFn ? backFn() : backFallbackFn() ">
    <i class="fa fa-chevron-left fa-lg"></i>
  </a>
</template>

<script setup="props, {emit}" lang="ts">

declare const props: {
  backFn?: () => void;
};

export default {
  emits: ['navigate']
};

export const backFallbackFn = (): void => emit('navigate', {
  name: 'HOME',
  params: {contentTransitionName: 'content-navigate-shallow'}
});
</script>
