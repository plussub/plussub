/**
 * Created by sbreitenstein on 19/01/17.
 */

Polymer({
    is: 'subtitle-selection-container',
    listeners: {
        "refreshSubtitle": "onRefreshSubtitle"
    },

    onRefreshSubtitle: function (event, data) {
        Array.from(this.querySelectorAll(".subtitle-selection-element"))
            .filter((selection) => selection !== data.selectionElement)
            .forEach((notActualSelection) => notActualSelection.reset());
    }
});