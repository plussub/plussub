/**
 * Created by sbreitenstein on 23/01/17.
 */

Polymer({
    is: "misc-options",
    openOptionPage: function () {
        chrome.tabs.create({
            url: "html/options.html"
        });
    }
});