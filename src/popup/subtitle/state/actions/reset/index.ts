export const reset = ():void => {
  window.plusSub_subtitle.value = {
    raw: null,
    parsed: [],
    withOffsetParsed: [],
    offsetTime: 0
  };
};
