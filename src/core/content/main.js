import {store} from '../redux/redux.js'
import VTTInjectService from './VTTInjectService.js';
import VideoMetaService from './VideoMetaService.js';
import CSSInjectService from './CSSInjectService.js';
import FindVideoService from './FindVideoService.js';

(async () => {
    await store.ready();
    VTTInjectService();
    VideoMetaService();
    CSSInjectService();
    FindVideoService();
    if (store.getState().debug.content) {
        console.log('Content script ready');
    }
})();