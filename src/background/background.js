import ReduxConfig from '../chrome/redux_config/master.js';
import ReduxImpl from './../redux/redux.js';

import Bridge from '../chrome/bridge/master.js';
import ParserService from './parser/ParserService.js';
import MovieSearchService from './movie_search/MovieSearchService.js';
import SubtitleSearchService from './subtitle_search/SubtitleSearchService.js';
import SubtitleDownloadService from './subtitle_download/SubtitleDownloadService.js';

Bridge();
ParserService();
MovieSearchService();
SubtitleSearchService();
SubtitleDownloadService();