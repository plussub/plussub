import { ref, UnwrapRef } from 'vue';
import { FileState } from '@/file/state/types';

export const init = (): void => {
  window.plusSub_file = window.plusSub_file
    ? ref({ ...window.plusSub_file.value })
    : ref<UnwrapRef<FileState>>({
        filename: ''
      });
};
