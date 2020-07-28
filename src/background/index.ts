import { reactive, watch } from 'vue';
import { snapshot, setAppStatePartial } from '#/../shared/appState';

//
// document.getElementById('target').addEventListener('click', function() {
//   chrome.runtime.getBackgroundPage(function(backgroundPage){
//     backgroundPage.backgroundFunction()
//   })
// });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.parse = () => {
  setAppStatePartial({
    state: 'PARSING'
  });
  console.warn('x');
  setTimeout(() => {
    setAppStatePartial({
      state: 'DONE'
    });
  }, 10000);
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   setTimeout(() => {
//     setAppStatePartial({
//       state: 'PARSING'
//     });
//   }, 3000);
// });

// (async () => {
//
//   chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       setTimeout(() => {
//         setAppStatePartial({
//           state: "PARSING"
//         });
//       }, 3000);
//       // console.log('wtf');
//       // console.log(sender.tab ?
//       //   "from a content script:" + sender.tab.url :
//       //   "from the extension");
//       // if (request.command == "parse")
//       //   sendResponse({farewell: "goodbye"});
//     });
//
//   // const appState = reactive(snapshot());
//   // const state = reactive({ someval: 'a' });
//   //
//   // watch(
//   //   () => appState.offsetTime,
//   //   (change) => console.warn(change),
//   //   {
//   //     deep: true
//   //   }
//   // );
//   // console.warn('wtf');
//   // console.warn(appState);
//   // setInterval(() => {
//   //   const time = 1+snapshot().offsetTime.time;
//   //   setAppStatePartial({
//   //     offsetTime: {
//   //       applied: false,
//   //       time
//   //     }
//   //   });
//   // }, 1000);
// })();
