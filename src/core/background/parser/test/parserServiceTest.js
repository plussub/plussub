//class under test
const root = require('../ParserService.js');

//test framework dependencies
const expect = require('chai').expect;

//application dependencies
let Descriptor = require('../../../descriptor/Descriptor.js').srtPlayer.Descriptor;
const redux = require('../../../redux/redux.js').srtPlayer.Redux;
const actionCreators = require('../../../redux/actionCreators.js').srtPlayer.ActionCreators;

//mocks
const happyPathParserMock = require('./SrtParserMock.js').srtMock.srtParserHappyPathMock;
const throwExceptionParserMock = require('./SrtParserMock.js').srtMock.srtParserThrowsExceptionMock;



describe('ParserService', () => {

    let parserService;

    beforeEach(() => {
        root.srtPlayer.SRTParser = happyPathParserMock;
        parserService = root.srtPlayer.ParserService();
    });

    afterEach(() => {
        parserService.shutdown();
        redux.dispatch(actionCreators.resetAll());
    });

    it('should parse unparsed subtitle', (done) => {

        let validateResult = (result) => {
            expect(result.parsed.length).to.equal(3);
        };

        let alreadyDone = false;
        let unsubscribe = redux.subscribe(() => {
            let subtitle = redux.getState().subtitle;
            if (subtitle.id !== -1) {
                unsubscribe();
                validateResult(subtitle);
                if (!alreadyDone) {
                    done();
                }
                alreadyDone = true;
            }
        });

        redux.dispatch(actionCreators.parseRawSubtitle('rawSrtData'));

    });


    it('should handle parse errors properly', (done) => {

        root.srtPlayer.SRTParser = throwExceptionParserMock;

        let validateResult = (subtitleState, errors) => {
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal("Parsing failed: parse error");
            expect(errors[0].src).to.equal("parserService");
        };

        let previousErrors=[];
        let unsubscribe = redux.subscribe(() => {
            let subtitleState = redux.getState().subtitle;
            let errors = redux.getState().errors;
            if(previousErrors.length === errors.length){
                return;
            }
            previousErrors = errors;
            if (errors.length>0) {
                unsubscribe();
                validateResult(subtitleState,errors);
                done();
            }
        });

        redux.dispatch(actionCreators.parseRawSubtitle('rawSrtData'));

    });

    it('should apply offset to parsed subtitle', (done) => {

        let expectSubtitle = {
            id: 'b3a0e285-f161-d402-2ae1-a302fb1feb59',
            parsed: [
                { id: 1, from: 10, to: 15, text: 'firstText' },
                { id: 2, from: 18, to: 33, text: 'secondText' },
                { id: 3, from: 45, to: 60, text: 'thirdText' }
            ],
            pastOffsetTime: 0,
            offsetTime: 0,
            offsetTimeApplied: true,
            raw: 'rawSrtData'
        };

        redux.getState().subtitle = expectSubtitle;

        let validateResult = (result) => {
            expect(result.parsed[0].from).to.equal(18);
            expect(result.parsed[0].to).to.equal(23);

            expect(result.parsed[1].from).to.equal(26);
            expect(result.parsed[1].to).to.equal(41);

            expect(result.parsed[2].from).to.equal(53);
            expect(result.parsed[2].to).to.equal(68);
        };

        let alreadyDone = false;
        let unsubscribe = redux.subscribe(() => {
            let subtitle = redux.getState().subtitle;
            if (subtitle.id !== expectSubtitle.id) {
                unsubscribe();
                validateResult(subtitle);
                if (!alreadyDone) {
                    done();
                }
                alreadyDone = true;
            }
        });

        redux.dispatch(actionCreators.setOffsetTimeForSubtitle(8));

    });


    it('when offset will be applied, it should recognize previous offset time ', (done) => {

        let expectSubtitle = {
            id: 'b3a0e285-f161-d402-2ae1-a302fb1feb59',
            parsed: [
                { id: 1, from: 10, to: 15, text: 'firstText' },
                { id: 2, from: 18, to: 33, text: 'secondText' },
                { id: 3, from: 45, to: 60, text: 'thirdText' }
            ],
            pastOffsetTime: 99,
            offsetTime: 3,
            offsetTimeApplied: true,
            raw: 'rawSrtData'
        };

        redux.getState().subtitle = expectSubtitle;

        let validateResult = (result) => {
            expect(result.parsed[0].from).to.equal(17);
            expect(result.parsed[0].to).to.equal(22);

            expect(result.parsed[1].from).to.equal(25);
            expect(result.parsed[1].to).to.equal(40);

            expect(result.parsed[2].from).to.equal(52);
            expect(result.parsed[2].to).to.equal(67);
        };

        let alreadyDone = false;
        let unsubscribe = redux.subscribe(() => {
            let subtitle = redux.getState().subtitle;
            if (subtitle.id !== expectSubtitle.id) {
                unsubscribe();
                validateResult(subtitle);
                if (!alreadyDone) {
                    done();
                }
                alreadyDone = true;
            }
        });

        redux.dispatch(actionCreators.setOffsetTimeForSubtitle(10));

    });

    it('should not change any offset if new offset is equals to old offset ', (done) => {

        let expectSubtitle = {
            id: 'b3a0e285-f161-d402-2ae1-a302fb1feb59',
            parsed: [
                { id: 1, from: 10, to: 15, text: 'firstText' }
            ],
            pastOffsetTime: 99,
            offsetTime: 3,
            offsetTimeApplied: true,
            raw: 'rawSrtData'
        };

        redux.getState().subtitle = expectSubtitle;

        let validateResult = (result) => {
            expect(result.parsed[0].from).to.equal(10);
            expect(result.parsed[0].to).to.equal(15);
        };

        let alreadyDone = false;
        let unsubscribe = redux.subscribe(() => {
            let subtitle = redux.getState().subtitle;
            if (subtitle.id === expectSubtitle.id) {
                unsubscribe();
                validateResult(subtitle);
                if (!alreadyDone) {
                    done();
                }
                alreadyDone = true;
            }
        });

        redux.dispatch(actionCreators.setOffsetTimeForSubtitle(3));
    });

});