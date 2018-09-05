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

        <v-btn mt-5 v-if="loading" flat @click="doCancel">Stop Search</v-btn>
        <v-btn v-if="debug" color="debug" class="white--text" @click="sendHeartBeat">HB</v-btn>
    </div>
</template>

<script>

    import {store} from "../../../core/redux/redux.js";
    import {
        triggerSubtitleSearch,
        triggerSubtitleSearchStop,
        selectSubtitle,
        sendHeartBeat
    } from "../../../core/redux/actionCreators.js";

    export default {
        data: () => ({
            debug: false,
            headers: [
                {text: 'Title', value: 'MovieName'},
                {text: 'Rating', value: 'SubRating'},
            ],
            filter: '',
            loading: true,
            result: []
        }),
        props: ['hasFocus'],
        created: function () {
            store.subscribe(() => {
                this.loading = store.getState().subtitleSearch.isLoading;
                if (this.result !== store.getState().subtitleSearch.result) {
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
                    //to prevent an empty datatable
                    this.loading = true;
                    this.doSearch();
                }
            }
        },

        methods: {

            doSearch() {
                //timeout needed because sync between language selection and background redux store
                setTimeout(() => {
                    console.log('do search sub');
                    console.log(`lang: ${store.getState().subtitleLanguage.iso639}`);
                    console.log(`tmbdId: ${store.getState().movieSearch.result[store.getState().movieSearch.selected].id}`);

                    store.dispatch(triggerSubtitleSearch({
                        queryLanguage: store.getState().subtitleLanguage.iso639,
                        queryTmdbId: store.getState().movieSearch.result[store.getState().movieSearch.selected].id
                    }));
                }, 100);
            },

            doSelect(selected) {
                store.dispatch(selectSubtitle(this.result.findIndex(x => x.IDSubtitleFile === selected.IDSubtitleFile)));
                console.log(`Selected subtitle: ${JSON.stringify(selected)}`);
                this.$emit('stepper-content-select');
            },

            doCancel() {
                store.dispatch(triggerSubtitleSearchStop());
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }
</script>