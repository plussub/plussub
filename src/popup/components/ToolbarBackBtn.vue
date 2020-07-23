<template>
  <a class="knopf flat pill small sharp buttonOnPrimary" @click="backFn ? backFn() : backFallbackFn() "><i class="fa fa-chevron-left fa-lg"></i></a>
</template>
<script>
export default {
  props: {
    backFn: Function
  },
  setup(props) {
    return {
      backFn: props.backFn,
      backFallbackFn () {
        this.$router.replace({ name: 'home', params: { showContentAnimation: 'content-navigate-shallow'} })
      }
    }
  }
};
</script>
