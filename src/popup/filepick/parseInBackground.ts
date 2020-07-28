import {getBackgroundPage} from 'getBackgroundPage';

export const parseInBackground = async (): Promise<void> => {
  (await getBackgroundPage()).plussub.parse();
};
