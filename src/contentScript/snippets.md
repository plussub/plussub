register listener
```javascript
window.addEventListener("message", (event) => console.warn(event.data));
```

request/response actions
```javascript
window.postMessage({plusSubContentScriptInput: 'FIND_VIDEOS_REQUEST', requestId: "givenRequestId"}, '*');
```

unidirectional actions
```javascript
//HIGHLIGHT
window.postMessage({plusSubContentScriptInput: 'HIGHLIGHT_VIDEO', id: "givenVideoId"}, '*');

window.postMessage({plusSubContentScriptInput: 'HIGHLIGHT_VIDEO', id: $0.dataset.plusSubId}, '*');

//REMOVE HIGHLIGHT
window.postMessage({plusSubContentScriptInput: 'REMOVE_HIGHLIGHT_FROM_VIDEO',}, '*');

//SET TIME
window.postMessage({plusSubContentScriptInput: 'SET_TIME', id: "givenVideoId", time: 2000}, '*');

window.postMessage({plusSubContentScriptInput: 'SET_TIME', id: $0.dataset.plusSubId, time: 2000}, '*');


//SELECT VIDEO
window.postMessage({plusSubContentScriptInput: 'SELECT_VIDEO', id: "givenVideoId"}, '*');

window.postMessage({plusSubContentScriptInput: 'SELECT_VIDEO', id: $0.dataset.plusSubId}, '*');
//DESELECT VIDEO
window.postMessage({plusSubContentScriptInput: 'DESELECT_VIDEO'}, '*');

//ADD SUBTITLE
window.postMessage({plusSubContentScriptInput: 'ADD_SUBTITLE', video: {id: 'givenVideoId'}, subtitle: {id: 'givenSubtitleId', entries: [{from: 0, to: 10000, text: "fooBar"}]}}, '*');

window.postMessage({plusSubContentScriptInput: 'ADD_SUBTITLE', video: {id: $0.dataset.plusSubId}, subtitle: {id: 'givenSubtitleId', entries: [{from: 0, to: 10000, text: "fooBar"}]}}, '*');

// APPLY_STYLE
window.postMessage({plusSubContentScriptInput: 'APPLY_STYLE', style: { 
  '--plusSub-cue-color': "green", 
  '--plusSub-cue-background-color': 'yellow', 
  '--plusSub-cue-font-size': '24px'
}}, '*');
```
