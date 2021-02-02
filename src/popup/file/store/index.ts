import {computed, ComputedRef, Ref, ref} from 'vue';

export interface FileState {
  filename: string;
}

export interface FileStore {
  state: ComputedRef<FileState>;
  actions: {
    setFilename: (payload: Pick<FileState, 'filename'>) => void;
    reset: () => void;
  };
}

declare global {
  interface Window {
    plusSub_file: Ref<FileState>;
  }
}

export const init = (): FileStore => {
  window.plusSub_file = window.plusSub_file
    ? ref({ ...window.plusSub_file.value })
    : ref<FileState>({
        filename: ''
      });

  return {
    state: computed(() => window.plusSub_file.value),
    actions: {
      setFilename: ({ filename }: Pick<FileState, 'filename'>) => (window.plusSub_file.value.filename = filename),
      reset: () => {
        window.plusSub_file.value = {
          filename: ''
        };
      }
    }
  };
};
