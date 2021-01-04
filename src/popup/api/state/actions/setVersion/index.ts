import {set as storageSet} from "storage";

export const setVersion = (version: 'stable' | 'dev'): void => {
  window.plusSub_api.value.version = version;
  storageSet({api: version});
};
