// import { Video, VideoSrc } from '@/iframe/video/state/types';
// import { srcToVideo } from '@/iframe/video/state/state';
// import { removeUrlHash } from '@/util/url';
// import { postWindowMessage, RemoveVideoInIFrame, useVideoElementMutationObserver, VideosInIFrame } from '@/composables';
// import { watch } from 'vue';
//
// const isValidVideo = (el: HTMLVideoElement): boolean => el.offsetWidth !== 0 && el.offsetHeight !== 0 && el.currentSrc !== '';
//
// const findVideosInCurrentTab = (): Record<VideoSrc, Video> =>
//   Object.fromEntries(
//     [...document.querySelectorAll('video')]
//       .filter((el) => isValidVideo(el))
//       .map((el) => [
//         removeUrlHash(el.currentSrc),
//         {
//           src: removeUrlHash(el.currentSrc),
//           hasSubtitle: el.classList.contains('plussub'),
//           el
//         }
//       ])
//   );
//
// const resetSrcToVideo = () => {
//   srcToVideo.value = findVideosInCurrentTab();
// };
//
// const getIframeSrc = () => {
//   const windowSelected = window.parent === window.top ? window : window.parent;
//   return windowSelected.frameElement ? windowSelected.frameElement.getAttribute('src') : windowSelected.location.href;
// };
//
// const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => value !== null && value !== undefined;
//
// export const init = (): void => {
//   resetSrcToVideo();
//   // handle iframe videos
//   // handles also if the source or the src changes
//   [...document.querySelectorAll('video')].forEach((el) => el.addEventListener('loadedmetadata', resetSrcToVideo));
//   // new videos added to the page
//   useVideoElementMutationObserver(({ added }) => {
//     resetSrcToVideo();
//     added.forEach((el) => el.addEventListener('loadedmetadata', resetSrcToVideo));
//   });
//
//   watch(
//     () => srcToVideo.value,
//     (srcToVideo, prevSrcToVideo) => {
//       const srcToVideoList = Object.values(srcToVideo);
//       const prevSrcToVideoList = prevSrcToVideo ? Object.values(prevSrcToVideo) : [];
//       if (srcToVideoList.length > prevSrcToVideoList.length) {
//         const videos = srcToVideoList
//           .filter((e) => !prevSrcToVideoList.includes(e))
//           .filter(notEmpty)
//           .map(({ el }) => el)
//           .filter(notEmpty)
//           .map((el) => ({
//             currentSrc: removeUrlHash(el.currentSrc),
//             hasSubtitle: el.classList.contains('plussub')
//           }));
//
//         postWindowMessage({
//           window: window.top,
//           origin: '*',
//           payload: {
//             plusSubAction: VideosInIFrame,
//             frameSrc: getIframeSrc() ?? '',
//             videos
//           }
//         });
//       } else if (srcToVideoList.length < prevSrcToVideoList.length) {
//         prevSrcToVideoList
//           .filter((e) => !srcToVideoList.some((_e) => _e.src === e.src))
//           .filter(notEmpty)
//           .map(({ el }) => el)
//           .filter(notEmpty)
//           .forEach((el) =>
//             postWindowMessage({
//               window: window.top,
//               origin: '*',
//               payload: {
//                 plusSubAction: RemoveVideoInIFrame,
//                 frameSrc: getIframeSrc() ?? '',
//                 currentSrc: removeUrlHash(el.currentSrc)
//               }
//             })
//           );
//       }
//     },
//     { immediate: true }
//   );
// };
