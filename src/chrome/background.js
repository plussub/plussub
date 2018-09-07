import Axios from 'axios';
import Pako from 'pako';

import ReduxConfig from './redux_config/master.js';
import ReduxImpl from './../core/redux/redux.js';
import ParserService from './../core/background/parser/ParserService.js';

import MovieSearchService from './../core/background/movie_search/MovieSearchService.js';
import SubtitleSearchService from './../core/background/subtitle_search/SubtitleSearchService.js';
import SubtitleDownloadService from './../core/background/subtitle_download/SubtitleDownloadService.js';

ParserService();
MovieSearchService();
SubtitleSearchService();
SubtitleDownloadService();