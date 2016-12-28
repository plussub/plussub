/**
 * Created by sonste on 27.12.2016.
 */
Polymer({

    is: 'selectize-wrapper',

    properties: {
        //selectize 1:1 mapping
        placeholder: {
            type: String,
            value: 'Select'
        },

        valueField: {
            type: String,
            value: ''
        },

        labelField: {
            type: String,
            value: ''
        },

        searchField: {
            type: String,
            value: ''
        },

        sortField: {
            type: Array,
            value: () => []
        },
        //end selecitze 1:1 mapping


        renderer: {
            type: String,
            value: ''
        },

        currentSelected: {
            type: Object,
            value: () => {
            },
            readonly: true,
            notify: true
        },

        loadFn: {
            type: Function,
            value: null
        },

        selectize: {
            type: Object,
            value: () => {
            },
        }
    },

    ready: function () {
        this.async(function () {
            $(this.$.selectize).selectize({
                valueField: this.valueField,
                labelField: this.labelField,
                searchField: this.searchField,
                sortField: this.sortField,
                placeholder: this.placeholder,
                highlight: false,
                persist: false,
                maxOptions: 20,
                loadThrottle: 1000,
                render: {option: (item) => Object.assign(document.createElement(this.renderer), {item: item})},
                loadingClass: 'loading',
                onChange: (data) => {
                    data = data === '' ? {} : data;
                    this.set('currentSelected', typeof data === 'string' ? JSON.parse(data) : data);
                },
                load: this.loadFn !== null ? this.loadFn.bind(this.parentNode) : null
            });

            this.selectize = $(this.$.selectize)[0].selectize;
            this.selectize.updatePlaceholder();
        });
    },

    addOption: function (option) {
        this.selectize.addOption(option);
    },

    addItem: function (item) {
        this.selectize.addItem(item);
    },

    clearOptions: function () {
        this.selectize.clearOptions();
    },

    clearCurrentSelection:function(){
        "use strict";
        this.selectize.clear();
    }

});
