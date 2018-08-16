/**
 * Created by sonste on 27.12.2016.
 */
class PlussubSelectizeWrapperElement extends Polymer.Element {

    static get is() {
        return "selectize-wrapper";
    }

    ready() {
        super.ready();

        $(this.$.selectize).selectize({
            valueField: this.valueField,
            labelField: this.labelField,
            searchField: this.searchField,
            sortField: this.sortField,
            placeholder: this.placeholder,
            highlight: false,
            persist: false,
            maxOptions: this.maxOptions,
            render: {
                option: (item) => Object.assign(document.createElement(this.renderer), {item: item})
            },
            loadingClass: 'loading',
            onChange: this.onChangeFn !== null ? this.onChangeFn.bind(this.parentNode) : null,
            onType:this.onTypeFn !== null ? this.onTypeFn.bind(this.parentNode) : null,
            onItemAdd:this.onItemAddFn !== null ? this.onItemAddFn.bind(this.parentNode) : null,
            load: this.loadFn !== null ? this.loadFn.bind(this.parentNode) : null
        });

        this.selectize = $(this.$.selectize)[0].selectize;
        this.selectize.updatePlaceholder();
        this.iconIsInvisible=true;


    }

    static get properties() {
        return {
            iconIsInvisible:{
                type: Boolean,
                value: true
            },

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

            maxOptions: {
                type: Number,
                value: 1000
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
            },

            onChangeFn:{
                type:Function,
                value:null
            },

            onTypeFn:{
                type:Function,
                value:null
            },

            onItemAddFn:{
                type:Function,
                value:null
            }
        }
    }

    loadingActive(isLoading){
        this.$.spinner.active=isLoading;
    }

    addOption(option) {
        this.selectize.addOption(option);
    }

    addItem(item,silent=false) {
        this.selectize.addItem(item,silent);
    }

    clearOptions() {
        if (this.selectize && this.selectize.clearOptions) {
            this.selectize.clearOptions();
            this.iconIsInvisible=true;
        }
    }

    clear(silent=false) {
        this.selectize.clear(silent);
        this.iconIsInvisible=true;
    }

    clearCurrentSelection() {
        this.selectize.clear();
        this.iconIsInvisible=true;

    }

    refreshOptions(triggerDropdown) {
        this.selectize.refreshOptions(triggerDropdown);
    }

    setValue(val, silent) {
        this.selectize.setValue(val, silent);
    }

    setTextboxValue(val) {
        this.selectize.setTextboxValue(val);
    }

    trigger(event) {
        this.selectize.trigger(event);
    }

    load(values) {
        this.selectize.load((fn) => fn(values));
        // console.log("load");
        this.iconIsInvisible=values.length === 0;
    }

    getOptions() {
        return this.selectize.options;
    }

    getItems() {
        return this.selectize.items;
    }

    getWrapped() {
        return this.selectize;
    }

}

customElements.define(PlussubSelectizeWrapperElement.is, PlussubSelectizeWrapperElement);