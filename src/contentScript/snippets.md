register listener
```javascript
window.addEventListener("message", (event) => console.warn(event.data));
```

request/response actions
```javascript
window.postMessage({contentScriptInput: 'FIND_VIDEOS_REQUEST', requestId: "givenRequestId"}, '*');
```

unidirectional actions
```javascript
//HIGHLIGHT
window.postMessage({contentScriptInput: 'HIGHLIGHT_VIDEO', id: "givenVideoId"}, '*');

window.postMessage({contentScriptInput: 'HIGHLIGHT_VIDEO', id: $0.dataset.plussub}, '*');

//REMOVE HIGHLIGHT
window.postMessage({contentScriptInput: 'REMOVE_HIGHLIGHT_FROM_VIDEO',}, '*');

//SET TIME
window.postMessage({contentScriptInput: 'SET_TIME', id: "givenVideoId", time: 2000}, '*');

window.postMessage({contentScriptInput: 'SET_TIME', id: $0.dataset.plussub, time: 2000}, '*');


//SELECT VIDEO
window.postMessage({contentScriptInput: 'SELECT_VIDEO', id: "givenVideoId"}, '*');

window.postMessage({contentScriptInput: 'SELECT_VIDEO', id: $0.dataset.plussub}, '*');
//DESELECT VIDEO
window.postMessage({contentScriptInput: 'DESELECT_VIDEO'}, '*');

//ADD SUBTITLE
window.postMessage({contentScriptInput: 'ADD_SUBTITLE', video: {id: 'givenVideoId'}, subtitle: {id: 'givenSubtitleId', entries: [{from: 0, to: 10000, text: "fooBar"}]}}, '*');

window.postMessage({contentScriptInput: 'ADD_SUBTITLE', video: {id: $0.dataset.plussub}, subtitle: {id: 'givenSubtitleId', entries: [{from: 0, to: 10000, text: "fooBar"}]}}, '*');

// APPLY_STYLE
window.postMessage({contentScriptInput: 'APPLY_STYLE', style: { 
  '--plussub-cue-color': "green", 
  '--plussub-cue-background-color': 'yellow', 
  '--plussub-cue-font-size': '24px'
}}, '*');
```
