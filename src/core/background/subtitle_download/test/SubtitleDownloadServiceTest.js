//class under test
const root = require('../SubtitleDownloadService.js');

//test framework dependencies
const expect = require('chai').expect;
const fetchMock = require('fetch-mock');

//application dependencies
const redux = require('../../../redux/redux.js').srtPlayer.Redux;
const actionCreators = require('../../../redux/actionCreators.js').srtPlayer.ActionCreators;
let Descriptor = require('../../../descriptor/Descriptor.js').srtPlayer.Descriptor;

//mocks
const srtInflaterResponseToAsciiMock = require('./InflaterMock.js').srtMock.srtInflaterResponseToAsciiMock;


describe('SubtitleDownloadService', () => {

    let subtitleDownloadService;
    const BASE_URL = 'https://app.plus-sub.com/v2/subtitle';


    let fakeFetch;

    beforeEach(() => {
        fakeFetch = fetchMock.sandbox();
        root.srtPlayer.Inflater = srtInflaterResponseToAsciiMock;
        subtitleDownloadService = root.srtPlayer.SubtitleDownloadService(fakeFetch);
    });

    afterEach(() => {
        fakeFetch.reset();
        subtitleDownloadService.shutdown();
        redux.dispatch(actionCreators.resetAll());
    });

    it('should http downloadlink transform to https and download link content', (done) => {

        const downloadLinkResult = "zipped result";

        fakeFetch.mock(`https://somedownloadlink`, downloadLinkResult);

        let alreadyValidated = false;
        let unsubscribe = redux.subscribe(() => {
            let subtitleDownload = redux.getState().subtitleDownload;
            if (!alreadyValidated && subtitleDownload.result === downloadLinkResult) {
                unsubscribe();
                done();
                alreadyValidated=true;
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleDownload("http://somedownloadlink"));
    });

    it('should handle invalid http status codes properly when download link content', (done) => {

        fakeFetch.mock(`https://somedownloadlink`, {
            status: 404
        });

        let validateResult = (subtitleDownload, errors) => {
            expect(subtitleDownload.downloadLink).to.equal("");
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal(`Failed to download subtitle. Status 404`);
            expect(errors[0].src).to.equal("subtitleDownloadService");
        };

        let previousErrors = [];
        let unsubscribe = redux.subscribe(() => {
            let subtitleDownload = redux.getState().subtitleDownload;
            let errors = redux.getState().errors;
            if (previousErrors.length === errors.length) {
                return;
            }
            previousErrors = errors;

            if (errors.length > 0) {
                unsubscribe();
                validateResult(subtitleDownload, errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleDownload("http://somedownloadlink"));
    });


    it('should handle connection errors properly when download link content', (done) => {
        fakeFetch.mock(`https://somedownloadlink`, () => {
            throw {
                type: "TypeError",
                message: "Failed to fetch"
            }
        });

        let validateResult = (subtitleDownload, errors) => {
            expect(subtitleDownload.downloadLink).to.equal("");
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal("Failed to download subtitle. Are you Disconnected? Err: ([object Object])");
            expect(errors[0].src).to.equal("subtitleDownloadService");
        };

        let previousErrors = [];
        let unsubscribe = redux.subscribe(() => {
            let subtitleDownload = redux.getState().subtitleDownload;
            let errors = redux.getState().errors;
            if (previousErrors.length === errors.length) {
                return;
            }
            previousErrors = errors;

            if (errors.length > 0) {
                unsubscribe();
                validateResult(subtitleDownload, errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSubtitleDownload("http://somedownloadlink"));

    });
});
