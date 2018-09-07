/**
 * Created by sonste on 07.02.2016.
 */
var srtMock = srtMock || {};
if (typeof exports !== 'undefined') {
    exports.srtMock = srtMock;
}

srtMock.srtParserHappyPathMock = srtMock.srtParserHappyPathMock || (() => {

        return {
            parse: () => {
                return [{
                    id: 1,
                    from: 10,
                    to: 15,
                    text: 'firstText'
                }, {
                    id: 2,
                    from: 18,
                    to: 33,
                    text: 'secondText'
                }, {
                    id: 3,
                    from: 45,
                    to: 60,
                    text: 'thirdText'
                }]
            }
        };
    });

srtMock.srtParserThrowsExceptionMock = srtMock.srtParserThrowsExceptionMock || (() => {

    return {
            parse: () => {
                throw "parse error";
            }
        };

    });