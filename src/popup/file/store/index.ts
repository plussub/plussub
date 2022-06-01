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
    extension_file: Ref<FileState>;
  }
}

export const init = (): FileStore => {
  window.extension_file = window.extension_file
    ? ref({ ...window.extension_file.value })
    : ref<FileState>({
        filename: ''
      });

  return {
    state: computed(() => window.extension_file.value),
    actions: {
      setFilename: ({ filename }: Pick<FileState, 'filename'>) => (window.extension_file.value.filename = filename),
      reset: () => {
        window.extension_file.value = {
          filename: ''
        };
      }
    }
  };
};
