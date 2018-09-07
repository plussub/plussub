import Axios from 'axios';
import Pako from 'pako';

import ReduxConfig from '../chrome/redux_config/master.js';
import ReduxImpl from './../redux/redux.js';
import ParserService from './parser/ParserService.js';

import MovieSearchService from './movie_search/MovieSearchService.js';
import SubtitleSearchService from './subtitle_search/SubtitleSearchService.js';
import SubtitleDownloadService from './subtitle_download/SubtitleDownloadService.js';

ParserService();
MovieSearchService();
SubtitleSearchService();
SubtitleDownloadService();