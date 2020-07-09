import {emitter} from './emitter.ts';
import { onMounted, onUnmounted } from 'vue';

export function useEventBusListener(eventName, handler) {
  onMounted(() => emitter.on(eventName, handler))
  onUnmounted(() => emitter.off(eventName, handler))
}
