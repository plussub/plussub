<template>
  <div class="">
    <span style="background-color: red;"> {{props.tmdbId}} </span>
    <span style="background-color: red;"> {{props.mediaType}} </span>
    <div style="grid-area: spacer;">&nbsp;</div>
  </div>
</template>

<script>
export default {
  props: {
    tmdbId: String,
    mediaType: String
  },
  setup(props) {
    return {
      props
    }
  }
};
</script>
<style scoped>
</style>
