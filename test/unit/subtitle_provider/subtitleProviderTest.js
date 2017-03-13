var expect = require('chai').expect;
var fetchMock = require('fetch-mock');
var nodeFetch = require('node-fetch');
var requirejs = require('requirejs');
var messageBus = require('../../../src/js/MessageBus.js');
var root = require('../../../src/js/background/subtitle_provider/SubtitleProvider.js');
var Descriptor = require('../../../src/js/Descriptor.js').srtPlayer.Descriptor;



describe('SubtitleProvider', ()=> {

    var SERVICE_CHANNEL;
    var subtitleProvider;
    var BASE_URL='https://0e53p7322m.execute-api.eu-central-1.amazonaws.com/release/subtitle';

    var DEFAULT_SUBTITLE_SEARCH_RESULT = [
        {
            "SubActualCD": "3",
            "MovieName": "Pulp Fiction",
            "SubBad": "0",
            "MovieHash": "0",
            "SubFileName": "Pulp_Fiction_(DivX_DVDrip)_-_CD_2.English.srt",
            "SubSumCD": "4",
            "ZipDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e95e0b77/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/subad/113540",
            "MovieNameEng": "",
            "SubSize": "63902",
            "IDSubtitleFile": "154506",
            "SubHash": "d78540d4c71a86ead6e832699b563216",
            "SubFeatured": "0",
            "SubAuthorComment": "",
            "SubDownloadsCnt": "533",
            "SubAddDate": "2005-03-01 00:00:00",
            "SubLastTS": "00:58:50",
            "SubAutoTranslation": "0",
            "MovieReleaseName": "Pulp Fiction",
            "SeriesIMDBParent": "0",
            "UserNickName": "original_masken (a)",
            "SubHearingImpaired": "0",
            "SubTSGroup": "79",
            "SubLanguageID": "eng",
            "SubFormat": "srt",
            "LanguageName": "English",
            "SubTranslator": "",
            "SeriesEpisode": "0",
            "UserRank": "bronze member",
            "MovieImdbRating": "8.9",
            "MovieTimeMS": "0",
            "MovieYear": "1994",
            "SubEncoding": "ASCII",
            "QueryNumber": "0",
            "SubHD": "0",
            "UserID": "39934",
            "MovieByteSize": "0",
            "MovieFPS": "0.000",
            "SubtitlesLink": "http://www.opensubtitles.org/en/subtitles/113540/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/pulp-fiction-en",
            "IDSubMovieFile": "0",
            "ISO639": "en",
            "SeriesSeason": "0",
            "SubFromTrusted": "0",
            "SubTSGroupHash": "2b63fa88c9cdee2f225fbcb20939f9c6",
            "MatchedBy": "imdbid",
            "SubDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e9740b7e/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/filead/154506.gz",
            "SubRating": "0.0",
            "QueryParameters": {
                "imdbid": "0110912",
                "sublanguageid": "eng"
            },
            "SubComments": "0",
            "MovieKind": "movie",
            "IDMovie": "60",
            "IDMovieImdb": "110912",
            "SubForeignPartsOnly": "0",
            "IDSubtitle": "113540"
        },
        {
            "SubActualCD": "2",
            "MovieName": "Pulp Fiction",
            "SubBad": "0",
            "MovieHash": "0",
            "SubFileName": "Pulp_Fiction_(DivX_DVDrip)_-_CD_1.Swedish.srt",
            "SubSumCD": "4",
            "ZipDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e95e0b77/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/subad/113540",
            "MovieNameEng": "",
            "SubSize": "65320",
            "IDSubtitleFile": "154507",
            "SubHash": "93576df6508d13e3b76da6f0d8f00f9e",
            "SubFeatured": "0",
            "SubAuthorComment": "",
            "SubDownloadsCnt": "533",
            "SubAddDate": "2005-03-01 00:00:00",
            "SubLastTS": "01:24:24",
            "SubAutoTranslation": "0",
            "MovieReleaseName": "Pulp Fiction",
            "SeriesIMDBParent": "0",
            "UserNickName": "original_masken (a)",
            "SubHearingImpaired": "0",
            "SubTSGroup": "36",
            "SubLanguageID": "eng",
            "SubFormat": "srt",
            "LanguageName": "English",
            "SubTranslator": "",
            "SeriesEpisode": "0",
            "UserRank": "bronze member",
            "MovieImdbRating": "8.9",
            "MovieTimeMS": "0",
            "MovieYear": "1994",
            "SubEncoding": "ASCII",
            "QueryNumber": "0",
            "SubHD": "0",
            "UserID": "39934",
            "MovieByteSize": "0",
            "MovieFPS": "0.000",
            "SubtitlesLink": "http://www.opensubtitles.org/en/subtitles/113540/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/pulp-fiction-en",
            "IDSubMovieFile": "0",
            "ISO639": "en",
            "SeriesSeason": "0",
            "SubFromTrusted": "0",
            "SubTSGroupHash": "5dda2ce3493edf07e9246586396e9919",
            "MatchedBy": "imdbid",
            "SubDownloadLink": "http://dl.opensubtitles.org/en/download/src-api/vrf-e9750b7f/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/filead/154507.gz",
            "SubRating": "0.0",
            "QueryParameters": {
                "imdbid": "0110912",
                "sublanguageid": "eng"
            },
            "SubComments": "0",
            "MovieKind": "movie",
            "IDMovie": "60",
            "IDMovieImdb": "110912",
            "SubForeignPartsOnly": "0",
            "IDSubtitle": "113540"
        }
    ];

    var fakeFetch;

    beforeEach(()=> {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(Descriptor.CHANNEL.SERVICE);
        fakeFetch = fetchMock.sandbox();
        subtitleProvider = root.srtPlayer.SubtitleProvider(messageBus,fakeFetch);
    });

    afterEach(()=>{
       fakeFetch.reset();
    });


    it('test happy path', (done)=> {

        var imdbid = "0110912";
        var iso639 = "eng";

        fakeFetch.mock(BASE_URL+'/'+imdbid+'/'+iso639, DEFAULT_SUBTITLE_SEARCH_RESULT);

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                expect(result.length).to.be.above(0);
                expect(result[0].movieTitle).to.equal('Pulp Fiction');
                done();
            }
        });

        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH,
            data: {
                imdbid:imdbid,
                iso639:iso639
            }
        });
    });


    it('empty result should also notify', (done)=> {

        var imdbid = "0110912";
        var iso639 = "eng";

        fakeFetch.mock(BASE_URL+'/'+imdbid+'/'+iso639, []);

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                expect(result.length).to.equal(0);
                done();
            }
        });

        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH,
            data: {
                imdbid:imdbid,
                iso639:iso639
            }
        });
    });

    it('bad parameter should produce an error message', (done)=> {

        var imdbid = "0110912";
        var iso639 = "INVALID";

        fakeFetch.mock(BASE_URL+'/'+imdbid+'/'+iso639, 400);

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                //should never reached, when reached call done multiple times
                done();
            }
        });

        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH,
            data: {
                imdbid:imdbid,
                iso639:iso639
            }
        });
        done();
    });
});