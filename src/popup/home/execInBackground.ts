import {getBackgroundPage} from "getBackgroundPage";

export const execInBackground = async (): Promise<void> => {
  (await getBackgroundPage()).plussub.exec();
};
