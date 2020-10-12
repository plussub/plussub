import { Ref } from '@vue/reactivity';

export type FileState = Ref<{
  filename: string;
}>;
