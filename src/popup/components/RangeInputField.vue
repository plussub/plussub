<template>
  <input ref="range" :value="modelValue" @input="setValue" type="range" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { useUnmountObservable } from '@/composables';

export default defineComponent({
  props: {
    modelValue: {
      type: Number as PropType<number>,
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
      setValue: (event) => emit('update:modelValue', subject.next(event.target.value))
    };
  }
});
</script>

<style>
sl-radio[checked]{
  --sl-color-primary-500: var(--sl-color-primary-700);
  --sl-color-primary-400: var(--sl-color-primary-700);
}

sl-radio::part(label) {
  font-size: var(--sl-font-size-x-small);
}
</style>
