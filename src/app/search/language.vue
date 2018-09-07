<template>
    <div>
        <v-text-field label="Filter language"
                      type="text"
                      v-model="filter"
                      @input="doFilterModified"
                      :append-icon="'fa-search'"
                      clearable>
        </v-text-field>

        <v-data-table :headers="headers" :items="iso639List" :search="filter"
                      hide-actions
                      style="overflow-y: scroll; height: 300px;">
            <template slot="items" slot-scope="props">
                <td @click="doSelect(props.item)">{{ props.item.iso639Name }}</td>
                <td @click="doSelect(props.item)">{{ props.item.iso639 }}</td>
                <td @click="doSelect(props.item)">{{ props.item.iso639_2 }}</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>

    import {store} from "../../redux/redux.js";
    import {
        selectSubtitleLanguage,
        sendHeartBeat
    } from "../../redux/actionCreators.js";

    import iso639List from './iso639List.js'

    export default {
        data: () => ({
            debug: false,
            iso639List: iso639List,
            filter: '',
            filterModified: false,
            headers: [
                {text: 'Language', value: 'iso639Name'},
                {text: 'Iso639', value: 'iso639'},
                {text: 'Iso639 (2)', value: 'iso639_2'}
            ],
            selected: ''
        }),

        created: function () {
            store.subscribe(() => {
                if (!this.filterModified) {
                    this.filter = store.getState().subtitleLanguage.iso639;
                }
            });
        },

        mounted: function () {
            this.sendHeartBeat();
        },

        methods: {

            doFilterModified() {
                this.filterModified = true;
            },

            doSelect(selected) {
                this.selected = selected.iso639;
                store.dispatch(selectSubtitleLanguage(this.selected));
                console.log(`Selected Language: ${this.selected}`);
                this.$emit('stepper-content-select');
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }

</script>