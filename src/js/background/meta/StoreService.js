/**
 * Created by sonste on 04.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.VersionService = require('./../Version/VersionService').srtPlayer.VersionService;
}

srtPlayer.StoreService = srtPlayer.StoreService || (()=> {



        var schemas = [];
        schemas[0] = (db) => db.createObjectStore('srtStore', {keyPath: 'store'});

        var currentVersion = srtPlayer.VersionService.getVersion();
        var request = window.indexedDB.open("srtStore", currentVersion);
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (event.oldVersion < event.newVersion) {
                try {
                    db.deleteObjectStore("srtStore");
                }catch (e) {
                    console.log("init");
                }
                db.createObjectStore('srtStore', {keyPath: 'store'})
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