<template>
  <input :value="modelValue" type="color" v-bind="$attrs" @input="setValue" />
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
      setValue: (event) => subject.next(event.target.value)
    };
  }
});
</script>
