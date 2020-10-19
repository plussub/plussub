import { setState, setSrc } from '@/app/state';
import { reset as resetSearch } from '@/search/state';
import { reset as resetSubtitle } from '@/subtitle/state';
import { reset as resetFile } from '@/file/state';

export const reset = (): void => {
  setState({ state: 'NONE' });
  setSrc({ src: 'NONE' });
  resetSearch();
  resetSubtitle();
  resetFile();
};
