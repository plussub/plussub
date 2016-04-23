/**
 * Created by sonste on 04.02.2016.
 */
var srtMock = srtMock || {};
if (typeof exports !== 'undefined') {
    require('es6-promise').polyfill();
    exports.srtMock = srtMock;
}
srtMock.StoreMockService = srtMock.StoreMockService ||  (()=> {

        function update(object) {
            return new Promise(resolve => {
                    resolve(object);
                });
        }

        function find(key){
            "use strict";
            return new Promise(resolve => {
                resolve();
            });
        }

        return {
            update: update,
            find:find
        };

    });