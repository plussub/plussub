var srtMock = srtMock || {};
if (typeof exports !== 'undefined') {
    exports.srtMock = srtMock;
}

srtMock.srtInflaterResponseToAsciiMock = srtMock.srtInflaterResponseToAsciiMock || (() => {

        return {
            inflate: async (response) => {
                return await response.text();
            }
        };
    });
