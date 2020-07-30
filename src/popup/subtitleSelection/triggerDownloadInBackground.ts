import {getBackgroundPage} from "getBackgroundPage";

export const triggerDownload = async (): Promise<void> => {
  (await getBackgroundPage()).plussub.triggerDownload();
};
