import {Ref} from "@vue/reactivity";

export type ApiState = Ref<{
  version: 'stable' | 'dev'
}>;

