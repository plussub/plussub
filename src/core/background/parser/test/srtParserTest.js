/**
 * Created by sonste on 07.02.2016.
 */
var expect = require('chai').expect;
var requirejs = require('requirejs');
var root = require('../SrtParser.js');

describe('SRTParser', ()=> {

    var parser;
    beforeEach(()=> {

        parser = root.srtPlayer.SRTParser();
    });

    it('should parse correctly subrip', ()=> {
        var parsedResult = parser.parse("1\n"
            + "00:01:42,821 --> 00:01:44,289\n"
            + "(SIREN WAILING IN DISTANCE)\n"
            + "\n"
            + "2\n"
            + "00:01:45,365 --> 00:01:48,084\n"
            + "<i>DRIVER: There's 100,000 streets in this city.</i>\n"
            + "\n"
            + "3\n"
            + " 00:01:49,077 --> 00:01:51,421\n"
            + "You don't need to know the route.\n");
        expect(parsedResult.length).to.equal(3);
        expect(parsedResult[0]).to.deep.equal({
            id: 1,
            from: 102821,
            to: 104289,
            text: '(SIREN WAILING IN DISTANCE)'
        });
        expect(parsedResult[1]).to.deep.equal({
            id: 2,
            from: 105365,
            to: 108084,
            text: '<i>DRIVER: There\'s 100,000 streets in this city.</i>'
        });
        expect(parsedResult[2]).to.deep.equal({
            id: 3,
            from: 109077,
            to: 111421,
            text: 'You don\'t need to know the route.'
        });
    });
});