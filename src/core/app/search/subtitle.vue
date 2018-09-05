<template>
    <div>
        <v-text-field label="Filter subtitle"
                      type="text"
                      v-model="filter"
                      :append-icon="'fa-search'"
                      clearable>
        </v-text-field>

        <v-layout v-if="loading" justify-center style="height: 300px;">
            <v-progress-circular size="72" color="primary" indeterminate></v-progress-circular>
        </v-layout>
        <v-data-table v-if="!loading" :headers="headers" :items="result" :search="filter" hide-actions
                      style="overflow-y: scroll; height: 300px;">
            <template slot="items" slot-scope="props">
                <td @click="doSelect(props.item)">{{ props.item.MovieName }}</td>
                <td @click="doSelect(props.item)">{{ props.item.SubRating }}</td>
            </template>
        </v-data-table>

        <v-btn mt-5 v-if="loading" flat @click="doCancel">Stop Search
        </v-btn>
        <v-btn v-if="debug" color="debug" class="white--text" @click="sendHeartBeat">HB</v-btn>
    </div>
</template>

<script>

    import {store} from "../../../core/redux/redux.js";
    import {
        sendHeartBeat,
        triggerSubtitleSearch
    } from "../../../core/redux/actionCreators.js";

    export default {
        data: () => ({
            debug: false,
            headers: [
                {text: 'Title', value: 'MovieName'},
                {text: 'Rating', value: 'SubRating'},
            ],
            filter: '',
            loading: false,
            result: []
        }),
        props: ['hasFocus'],
        created: function () {
            store.subscribe(() => {
                this.loading = store.getState().subtitleSearch.isLoading;

                if (this.result !== store.getState().subtitleSearch.result) {
                    console.warn(this.result);
                    this.result = store.getState().subtitleSearch.result;
                }
            });
        },

        mounted: function () {
            this.sendHeartBeat();
        },

        watch: {
            hasFocus: function (hasFocus) {
                if (hasFocus) {
                    this.doSearch();
                }
            }
        },

        methods: {

            doSearch() {
                setTimeout(() => {
                    console.warn("do search sub");
                    console.warn(store.getState().subtitleLanguage.iso639);
                    console.warn(store.getState().movieSearch.result[store.getState().movieSearch.selected].id);

                    store.dispatch(triggerSubtitleSearch({
                        queryLanguage: store.getState().subtitleLanguage.iso639,
                        queryTmdbId: store.getState().movieSearch.result[store.getState().movieSearch.selected].id
                    }));
                }, 500);
            },

            doSelect(val) {
                console.log(`subtitle selected: ${val}`);
                console.log(`index: ${this.result.findIndex(e => e.IDSubtitleFile === val.IDSubtitleFile)}`);
            },

            doCancel() {
                console.warn('cancel')
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }
</script>