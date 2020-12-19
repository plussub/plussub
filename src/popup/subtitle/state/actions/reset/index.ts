export const reset = ():void => {
  window.plusSub_subtitle.value = {
    id: null,
    raw: null,
    format: null,
    parsed: [],
    withOffsetParsed: [],
    offsetTime: 0
  };
};
