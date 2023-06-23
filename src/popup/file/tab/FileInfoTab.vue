<template>
  <div class='p-2 max-w-full'>
    <h1 class='mb-2 text-xl font-bold tracking-tight'>Subtitle statistics</h1>
    <div class='pl-2 pt-2 mb-3 font-normal leading-relaxed flex text-sm'>
      <div class='font-bold'>Filename </div>
      <span class='pl-2 leading-normal'>{{ filename }}</span>
    </div>
    <div class='pl-2 mb-3 font-normal leading-relaxed flex text-sm'>
      <div class='font-bold'>Lines </div>
      <span class='pl-2 leading-normal'>{{ countSubtitleLines }}</span>
    </div>
    <div class='pl-2 mb-3 font-normal leading-relaxed flex text-sm'>
      <div class='font-bold'>Duration </div>
      <span class='pl-2 leading-normal'>{{ maxSubtitleDuration }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props:{
    filename: {
      type: String,
      default: ""
    },
    countSubtitleLines: {
      type: Number,
      default: 0
    },
    maxSubtitleDuration: {
      type: String,
      default: ""
    }
  }
});
</script>
