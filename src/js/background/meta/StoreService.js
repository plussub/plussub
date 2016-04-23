/**
 * Created by sonste on 04.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.ServiceDescriptor = require('./../../ServiceDescriptor').srtPlayer.ServiceDescriptor;
}
srtPlayer.StoreService = srtPlayer.StoreService || (()=> {

        var schemas = [];
        schemas[0] = (db) => db.createObjectStore('srtStore', {keyPath: 'store'});

        var request = window.indexedDB.open("srtStore", 1);
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            for (var i = event.oldVersion; i < event.newVersion; i++) {
                schemas[i](db);
            }
        };

        var promiseDBConnection = new Promise(resolve => {
            request.onsuccess = (event) => resolve(request.result);
        });


        function update(object) {

            return promiseDBConnection.then(db =>
                new Promise(resolve => db.transaction('srtStore', 'readwrite').objectStore('srtStore').put(object).onsuccess = resolve)
            );
        }

        function find(key) {
            return promiseDBConnection.then(db =>
                new Promise(resolve => db.transaction('srtStore', 'readonly').objectStore('srtStore').get(key).onsuccess=resolve)
            ).then(event => {
                return event.currentTarget.result;
            });
        }

        return {
            update: update,
            find:find
        };

    })();