import {emitter} from "@/composables/emitter";

export function emit(eventName, payload) {
  emitter.emit(eventName, payload);
}
