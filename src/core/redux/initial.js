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
            query: "",
            previousQuery:"",
            isLoading: false,
            isStopping: false,
            stopped: false,
            resultId: -1,
            result: [],
            selected: -1,
        },

        movieInfo: {
            id: -1,
            title: "",
            poster: null,
            src: ""
        },

        subtitleSearch: {
            imdbId: "",
            language: "eng",
            isLoading: false,
            resultId: -1,
            result: [],
            selected: -1,
        },

        subtitleDownload: {
            downloadLink: "",
            isLoading: false,
            resultId: -1,
            result: ""
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