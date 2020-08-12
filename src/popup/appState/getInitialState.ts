import {version} from "../../../package.json";
import {AppState} from "./types";

export const getInitialState = (): AppState => ({
  debug: true,
  version,
  state: 'NONE',
  src: 'NONE',
  search: null,
  filePick: null,
  offsetTime: 0,
  targetSrc: null,
  srt: {
    raw: null,
    parsed: [],
    withOffsetParsed: []
  }
});
