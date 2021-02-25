<template>
  <div>

    <sl-tab-group>
      <sl-tab slot="nav" panel="time">Time</sl-tab>
      <sl-tab slot="nav" panel="appearance">Appearance</sl-tab>

      <sl-tab-panel name="time">
        <div class="grid offset-time--container">
          <div class="flex w-full flex-wrap mx-2 focus-within:text-primary-700" style="grid-area: input">
            <div class="text-xs font-medium w-full" style="grid-area: input-label">Offset time (in ms)</div>
            <div class="w-full flex px-2 mt-0.5">
              <input ref="range" :value="offsetTime" type="range" step="100" min="-3000" max="3000" style="width: 30%" class="mr-6" @input="setOffsetTime" />
              <InputField v-model="offsetTime" step="100" type="number" class="pr-2" />
            </div>
          </div>
          <div class="font-medium text-xs mx-2 flex" style="grid-area: preview-label">
            <span class="flex-grow">Preview (next 3 subtitles)</span>
            <label for="excerpt" class="pr-1">Excerpt</label>
            <input id="excerpt" v-model="previewSelection" type="radio" value="excerpt" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />
            <label for="diagram" class="pr-1">Diagram</label>
            <input id="diagram" v-model="previewSelection" type="radio" value="diagram" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />
          </div>
          <Excerpt v-if="previewSelection === 'excerpt'" style="grid-area: preview; height: 150px; width: calc(100% - 12px)" />
          <Timeline v-else style="grid-area: preview; height: 80px; width: calc(100% - 12px)" class="mt-5" />
        </div>
      </sl-tab-panel>
      <sl-tab-panel name="appearance"><sl-color-picker opacity inline v-on="{ 'sl-change': wat }"></sl-color-picker></sl-tab-panel>
    </sl-tab-group>

<!--    <sl-details :summary="currentTime">-->
<!--      <div class="grid offset-time&#45;&#45;container">-->
<!--        <div class="flex w-full flex-wrap mx-2 focus-within:text-primary-700" style="grid-area: input">-->
<!--          <div class="text-xs font-medium w-full" style="grid-area: input-label">Offset time (in ms)</div>-->
<!--          <div class="w-full flex px-2 mt-0.5">-->
<!--            <input ref="range" :value="offsetTime" type="range" step="100" min="-3000" max="3000" style="width: 30%" class="mr-6" @input="setOffsetTime" />-->
<!--            <InputField v-model="offsetTime" step="100" type="number" class="pr-2" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="font-medium text-xs mx-2 flex" style="grid-area: preview-label">-->
<!--          <span class="flex-grow">Preview (next 3 subtitles)</span>-->
<!--          <label for="excerpt" class="pr-1">Excerpt</label>-->
<!--          <input id="excerpt" v-model="previewSelection" type="radio" value="excerpt" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />-->
<!--          <label for="diagram" class="pr-1">Diagram</label>-->
<!--          <input id="diagram" v-model="previewSelection" type="radio" value="diagram" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />-->
<!--        </div>-->
<!--        <Excerpt v-if="previewSelection === 'excerpt'" style="grid-area: preview; height: 150px; width: calc(100% - 12px)" />-->
<!--        <Timeline v-else style="grid-area: preview; height: 80px; width: calc(100% - 12px)" class="mt-5" />-->
<!--      </div>-->
<!--    </sl-details>-->

<!--    <Expandable :open="true">-->
<!--      <template #title>-->
<!--        <div class="font-medium font-header">-->
<!--          <span class="pr-2">Time</span><span>{{ currentTime }}</span>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #content>-->
<!--        <div class="grid offset-time&#45;&#45;container">-->
<!--          <div class="flex w-full flex-wrap mx-2 focus-within:text-primary-700" style="grid-area: input">-->
<!--            <div class="text-xs font-medium w-full" style="grid-area: input-label">Offset time (in ms)</div>-->
<!--            <div class="w-full flex px-2 mt-0.5">-->
<!--              <input ref="range" :value="offsetTime" type="range" step="100" min="-3000" max="3000" style="width: 30%" class="mr-6" @input="setOffsetTime" />-->
<!--              <InputField v-model="offsetTime" step="100" type="number" class="pr-2" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="font-medium text-xs mx-2 flex" style="grid-area: preview-label">-->
<!--            <span class="flex-grow">Preview (next 3 subtitles)</span>-->
<!--            <label for="excerpt" class="pr-1">Excerpt</label>-->
<!--            <input id="excerpt" v-model="previewSelection" type="radio" value="excerpt" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />-->
<!--            <label for="diagram" class="pr-1">Diagram</label>-->
<!--            <input id="diagram" v-model="previewSelection" type="radio" value="diagram" class="mr-1 text-primary-700 focus:ring-0 focus:ring-offset-0" />-->
<!--          </div>-->
<!--          <Excerpt v-if="previewSelection === 'excerpt'" style="grid-area: preview; height: 150px; width: calc(100% - 12px)" />-->
<!--          <Timeline v-else style="grid-area: preview; height: 80px; width: calc(100% - 12px)" class="mt-5" />-->
<!--        </div>-->
<!--      </template>-->
<!--    </Expandable>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { computed } from '@vue/reactivity';
import Expandable from '@/components/Expandable.vue';
import Timeline from './Timeline.vue';
import Excerpt from './Excerpt.vue';
import InputField from '@/components/InputField.vue';
import { VideoStore } from '@/video/store';
import Duration from 'luxon/src/duration';
import { SubtitleStore } from '@/subtitle/store';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { useUnmountObservable } from '@/composables';

export default defineComponent({
  components: {
    Excerpt,
    Timeline,
    InputField,
    Expandable
  },
  setup() {
    const subtitleStore = inject<SubtitleStore>('subtitleStore');
    const videoStore = inject<VideoStore>('videoStore');
    const unmountObservable = useUnmountObservable();

    if (!subtitleStore || !videoStore) {
      throw new Error('inject failed');
    }

    const currentTime = ref<string>(Duration.fromMillis(0).toFormat('hh:mm:ss'));

    videoStore.actions.useTimeUpdate(({ time }): void => {
      currentTime.value = Duration.fromMillis(time * 1000).toFormat('hh:mm:ss');
    });

    const offsetTime = computed({
      get: () => subtitleStore.state.value.offsetTime,
      set: (val) => {
        const offsetTime = parseInt(val.toString());
        subtitleStore.actions.setOffsetTime({ offsetTime: Number.isNaN(offsetTime) ? 0 : offsetTime });
      }
    });
    const offsetTimeSubject = new Subject<string>();
    offsetTimeSubject
      .pipe(
        throttleTime(50, asyncScheduler, { leading: true, trailing: true }),
        tap((val) => {
          offsetTime.value = parseInt(val.toString());
        }),
        takeUntil(unmountObservable)
      )
      .subscribe();

    const range = ref<HTMLInputElement | null>(null);

    return {
      currentTime,
      range,
      setOffsetTime: () => offsetTimeSubject.next(range.value?.value),
      offsetTime,
      reset: () => (offsetTime.value = 0),
      previewSelection: ref('excerpt'),
      wat: (event) => console.warn(event)
    };
  }
});
</script>

<style scoped>
.offset-time--container {
  grid-template-areas:
    '.'
    'input-label'
    'input'
    '.'
    'preview-label'
    '.'
    'preview';
  grid-template-rows: 8px auto auto 16px auto 8px auto;
}
</style>
