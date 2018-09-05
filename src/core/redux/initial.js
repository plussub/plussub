export default {

    state: {

        schemaVersion: 253,

        appState: {
            selectedMode: 0,
            openOptionPage: ''
        },

        option: {
            css: "::cue(.srtPlayer)\n" +
            "{\n" +
            " /* background-color:black; \n" +
            " color:white; \n" +
            " font-size:20px; */\n" +
            "}",
            subtitleVertical: '',
            subtitleLine: 'auto',
            subtitlePosition: 'auto',
            subtitleAlign: 'center',
            subtitleSize: 100
        },

        subtitle: {
            id: -1,
            parsed: [],
            pastOffsetTime: 0,
            offsetTime: 0,
            offsetTimeApplied: true,
            raw: ""
        },

        movieSearch: {
            requestId: "",
            prevRequestId: "",

            query: "",
            isLoading: false,
            isStopping: false,
            stopped: false,
            resultId: -1,
            result: [],
            selected: -1,
        },

        subtitleLanguage: {
            iso639: ''
        },

        subtitleSearch: {
            requestId: "",
            prevRequestId: "",

            queryTmdbId: "",
            queryLanguage: "",

            isLoading: false,
            isStopping: false,
            stopped: false,

            resultId: -1,
            result: [],
            selected: -1
        },

        subtitleDownload: {
            requestId: "",
            prevRequestId: "",

            downloadLink: "",

            isLoading: false,
            isStopping: false,
            stopped: false,

            resultId: -1,
            result: ""
        },

        movieInfo: {
            id: -1,
            title: "",
            poster: null,
            src: ""
        },

        //videoMeta is transient
        videoMeta: {
            tickInMs: 0,
            foundVideo: false,
            currentVideos: []
        },

        errors: [],

        debug: {
            app: false,
            option: false,
            messageBridge: false,
            content: false,
            redux: false
        }
    }
}