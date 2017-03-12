/**
 * Created by sbreitenstein on 19/01/17.
 */

Polymer({
    is: 'subtitle-selection-container',
    behaviors: [tms.ServiceChannelBehavior],
    listeners: {
        "refreshSubtitle": "onRefreshSubtitle",
        "resetAllSubtitleSelections": "onResetAllSubtitleSelections"
    },

    onRefreshSubtitle: function (event, data) {
        Array.from(this.querySelectorAll(".subtitle-selection-element"))
            .filter((selection) => selection !== data.selectionElement)
            .forEach((notActualSelection) => notActualSelection.reset());
    },

    onResetAllSubtitleSelections: function () {
        Array.from(this.querySelectorAll(".subtitle-selection-element"))
            .forEach((selectionElement) => selectionElement.reset());

        this.servicePublish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.PARSER.SUB.RESET,
            data:{}
        });
    }
});