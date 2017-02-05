/**
 * Created by sbreitenstein on 17/01/17.
 */

Polymer({
    is: 'plussub-app',
    openOptionPage: function () {
        chrome.tabs.create({
            url: "html/options.html"
        });
    },
    reset:function(){
        document.querySelector("subtitle-selection-container").onResetAllSubtitleSelections();
    }
});