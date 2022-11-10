<template>
  <div class='p-6 max-w-sm bg-surface-50 rounded-lg border border-gray-200 shadow-md'>
    <h1 class='mb-2 text-2xl font-bold tracking-tight'>Subtitle statistics</h1>
    <div class='pl-2 mb-3 font-normal leading-relaxed'>
      <div class='font-bold'>Format </div>
      <span class='pl-2 leading-normal'>{{ format }}</span>
    </div>
    <div class='pl-2 mb-3 font-normal leading-relaxed'>
      <div class='font-bold'>Language </div>
      <span class='pl-2 leading-normal'>{{ language }}</span>
    </div>
    <div class='pl-2 mb-3 font-normal leading-relaxed'>
      <div class='font-bold'>Lines </div>
      <span class='pl-2 leading-normal'>{{ countSubtitleLines }}</span>
    </div>
    <div class='pl-2 mb-3 font-normal leading-relaxed'>
      <div class='font-bold'>Duration </div>
      <span class='pl-2 leading-normal'>{{ maxSubtitleDuration }}</span>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    format: {
      type: String,
      default: ""
    },
    language: {
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
