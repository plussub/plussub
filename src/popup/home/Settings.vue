<template>
  <div>
    <expandable open>
      <template #title>
        Subtitle Setting
      </template>
      <template #content>
        <div>
          <div>Offset time</div>
          <div style="display: flex; width: 100%;">
            <div>
              <span style="font-size: 0.8em;">Actual</span>
              <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" :value="12"
                     type="text" disabled/>
            </div>
            <div>
              <span style="font-size: 0.8em;">New</span>
              <input ref="input" style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" type="text" v-model="newOffsetTime"/>
            </div>
          </div>
          <div>Preview</div>
          <textarea disabled style="width: 100%; resize: none; height: 150px" v-model="excerpt">
        </textarea>
          <div>
            <a class="knopf flat small" @click="setOffsetTime">Apply</a>
            <a class="knopf flat small" @click="reset">Reset</a>
          </div>
        </div>
        <div>
          Position
        </div>
      </template>
    </expandable>
  </div>
</template>

<script>
import {ref} from 'vue';
import Expandable from '@/components/Expandable';
import {computed} from '@vue/reactivity';

export default {
  components: {
    Expandable
  },
  props: {
    parsed: Array,
  },
  setup(props, {emit}) {
    const parsedPartial = ref(JSON.parse(JSON.stringify(props.parsed.length > 10 ? props.parsed.slice(0, 10) : props.parsed)));
    console.warn(parsedPartial.value);
    const newOffsetTime = ref('');

    const getTimestamp = ({time, offset}) => {
      const parsedOffset = parseInt(offset,10);

      const value = parseInt(time, 10) + (isNaN(parsedOffset) ? 0 : parsedOffset);
      const milliseconds = parseInt(String(value).slice(-3), 10);
      const seconds = Math.trunc((value / 1000) % 60) ;
      const minutes = Math.trunc((value / (1000*60)) % 60);
      const hours   = Math.trunc((value / (1000*60*60)) % 24);
      return `${hours > 9 ? '' : '0'}${hours}:${minutes > 9 ? '' : '0'}${minutes}:${seconds > 9 ? '' : '0'}${seconds}.${milliseconds}`
    }

    return {
      excerpt: computed(() => {
        return parsedPartial.value.map(({from, to, text}, i) => `${i+1}\n${getTimestamp({time: from, offset: newOffsetTime.value})} --> ${getTimestamp({time: to, offset: newOffsetTime.value})}\n${text}\n`).join('\n');
      }),
      newOffsetTime,
      setOffsetTime(event) {
        console.log(newOffsetTime.value);
        console.log(parseInt(newOffsetTime.value));
        emit('offset-time', {
          offsetTime: parseInt(newOffsetTime.value)
        });
      }
    }
  }
}
</script>
