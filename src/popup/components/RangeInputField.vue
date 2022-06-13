<template>
  <input :value="modelValue" type="range" v-bind="$attrs" @input="setValue" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { useUnmountObservable } from '../composables';

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const unmountObservable = useUnmountObservable();
    const subject = new Subject<number>();
    subject
        .pipe(
            throttleTime(50, asyncScheduler, { leading: true, trailing: true }),
            tap((val) => emit('update:modelValue', val)),
            takeUntil(unmountObservable)
        )
        .subscribe();
    return {
      setValue: (event) => subject.next(event.target.value)
    };
  }
});
</script>

<style>
input[type=range]:focus,input[type=range]:active,input[type=range] {
  -webkit-appearance: none;
  border: none;
  background-color: transparent;
  outline: none;
}

input[type=range]::-webkit-slider-runnable-track {
  height: 1px;
  background: #374151;
  border: none;
  border-radius: 3px;
}

input[type=range]::-moz-range-track {
  height: 1px;
  background: #374151;
  border: none;
  border-radius: 3px;
}

input[type=range]::-moz-range-thumb {
  -webkit-appearance: none;
  border: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #0e7490;
  margin-top: -6px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #0e7490;
  margin-top: -6px;
}

</style>
