import { FileState } from '@/file/state/types';
import { UnwrapRef } from 'vue';

export const setFilename = ({ filename }: Pick<UnwrapRef<FileState>, 'filename'>): void => {
  window.plusSub_file.value.filename = filename;
};
