export default {

    state: {

        schemaVersion: 253,

        appState: {
            selectedMode: 0
        },

        option: {
            css: "#editCSS{ font-size:20px;} \n ::cue(.srtPlayer){ \/* background-color:black; \n color:white; \n font-size:20px; *\/}",
            subtitleProperties: {
                position: 50
            } //cue properties
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
            isLoading: false,
            resultId: -1,
            result: [],
            selected: -1,
        },

        movieInfo: {
            id: -1,
            title: "-",
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
            messageBridge: true,
            content: true,
            showDebugConsole: false,
            enableDebugConsole: false,
            redux: false,
            reduxStore: false,
            disableStoreReduxState: false
        }
    }
}