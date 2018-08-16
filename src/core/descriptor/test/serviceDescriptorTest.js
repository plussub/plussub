//testframework dependency
const expect = require('chai').expect;


describe('Descriptor', ()=> {


    let descriptor;
    beforeEach(()=> {
        descriptor = require('../Descriptor').srtPlayer.Descriptor;
    });

    it('should generate path', ()=> {
        
        expect(descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE).to.equal('subtitleOffset.value');
        expect(descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE).to.equal('remove.currentSubtitle');
    });
});