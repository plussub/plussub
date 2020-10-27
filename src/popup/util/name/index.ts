const REGEX_JAPANESE = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/;
const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
const REGEX_SPECIAL_CHAR = /^(.*?)[ (（[0-9_ ：第-]/;

export const getVideoName = (): string => {
  // console.log(window.location.hostname);
  // console.log(document.title);
  switch (window.location.hostname) {
    case 'www.youtube.com':
      return document.title.replace(' - YouTube', '');
    case 'vimeo.com':
      return document.title.replace(' on Vimeo', '');
    case 'flixtor.to':
      return document.querySelector('.watch-header.h4.mb-0.font-weight-normal.link.hidden-sm-down')?.firstChild?.textContent?.trim() ?? '1';
    default:
      if (REGEX_JAPANESE.test(document.title[0]) || REGEX_CHINESE.test(document.title[0])) {
        const nameRegexResult = REGEX_SPECIAL_CHAR.exec(document.title);
        if (nameRegexResult && nameRegexResult[1]) return nameRegexResult[1].replace(/(合集|DVD版|(国|粤)语)/, '');
      }
      return document.title;
  }
};
