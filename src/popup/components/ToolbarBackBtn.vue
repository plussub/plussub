<template>
  <a class="knopf flat pill sharp buttonOnPrimary" @click="backFn ? backFn() : backFallbackFn() "><i class="fa fa-chevron-left fa-lg"></i></a>
</template>
<script>
export default {
  props: {
    backFn: Function
  },
  setup(props, {emit}) {
    return {
      backFn: props.backFn,
      backFallbackFn () {
        emit('navigate', { name: 'HOME', params: { contentTransitionName: 'content-navigate-shallow' } })
      }
    }
  }
};
</script>
