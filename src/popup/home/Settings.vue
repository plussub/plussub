<template>
  <div>
    <expandable open>
      <template #title>
        <div style="font-weight: 500; font-family: 'Rubik', sans-serif">
          Subtitle Setting
        </div>
      </template>
      <template #content>
        <div class="offset-time--container">
          <div style="grid-area: input-label; font-weight: 500; font-size: 0.75em;">Offset time (in ms)</div>
          <div style="grid-area: input; display: flex; width: 100%;">
            <input ref="input" style="height: 1.5em; flex-grow: 1; font-size: 1em;" type="text"
                   v-model="currentOffsetTime"/>
            <div>
              <a class="knopf flat small" @click="setOffsetTime">Apply</a>
              <a class="knopf flat small" @click="reset">Reset</a>
            </div>
          </div>
          <div style="grid-area: preview-label; font-weight: 500; font-size: 0.75em;">Preview <span v-if="notApplied" style="color:#c35e5e;">(not applied)</span></div>
          <textarea disabled style="grid-area: preview; width: 100%; resize: none; height: 150px; font-size: 0.75em; font-family: Roboto,sans-serif; font-weight: 500;" v-model="excerpt">
        </textarea>
        </div>
      </template>
    </expandable>
  </div>
</template>

<script>
import {ref, watch} from 'vue';
import Expandable from '@/components/Expandable';
import {computed} from '@vue/reactivity';

export default {
  components: {
    Expandable
  },
  props: {
    parsed: Array,
    offsetTime: Number
  },
  setup(props, {emit}) {
    const parsedPartial = computed(() => JSON.parse(JSON.stringify(props.parsed.length > 10 ? props.parsed.slice(0, 10) : props.parsed)));
    const currentOffsetTime = ref(props.offsetTime ? props.offsetTime : '');

    const getTimestamp = ({time, offset}) => {
      const parsedOffset = parseInt(offset, 10);

      const value = parseInt(time, 10) + (isNaN(parsedOffset) ? 0 : parsedOffset);
      const milliseconds = parseInt(String(value).slice(-3), 10);
      const seconds = Math.trunc((value / 1000) % 60);
      const minutes = Math.trunc((value / (1000 * 60)) % 60);
      const hours = Math.trunc((value / (1000 * 60 * 60)) % 24);
      return `${hours > 9 ? '' : '0'}${hours}:${minutes > 9 ? '' : '0'}${minutes}:${seconds > 9 ? '' : '0'}${seconds}.${milliseconds > 99 ? '' : '0'}${milliseconds > 9 ? '' : '0'}${milliseconds}`
    }
    return {
      excerpt: computed(() => {
        return parsedPartial.value.map(({from, to, text}, i) => `${i + 1}\n${getTimestamp({
          time: from,
          offset: currentOffsetTime.value
        })} --> ${getTimestamp({time: to, offset: currentOffsetTime.value})}\n${text}\n`).join('\n');
      }),
      currentOffsetTime,
      setOffsetTime(event) {
        emit('offset-time', {offsetTime: parseInt(currentOffsetTime.value)});
      },
      reset() {
        currentOffsetTime.value = 0;
        this.setOffsetTime();
      },
      notApplied: computed(() => {
        if(!props.offsetTime && !currentOffsetTime.value){
          return false;
        }
        return props.offsetTime !== parseInt(currentOffsetTime.value, 10);
      })
    }
  }
}
</script>

<style scoped>/* plussub header */
.offset-time--container {
  display: grid;
  grid-template-areas:
      '.'
      'input-label'
      'input'
      '.'
      'preview-label'
      'preview';
  grid-template-rows: 8px auto auto 16px auto auto;
}
</style>
