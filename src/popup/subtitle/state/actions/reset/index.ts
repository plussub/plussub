export const reset = ():void => {
  window.plusSub_subtitle.value = {
    raw: null,
    format: null,
    parsed: [],
    withOffsetParsed: [],
    offsetTime: 0
  };
};
