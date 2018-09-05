<template>
    <div>
        <v-text-field label="Search a movie title"
                      clearable
                      type="text"
                      v-model="query"
                      @input="doQueryModified"
                      @keyup.enter="doSearch"
        >

            <v-layout slot="append">
                <v-icon @click="doSearch" size="24">fa-search</v-icon>
            </v-layout>
        </v-text-field>

        <v-layout v-if="loading" justify-center style="height: 300px;">
            <v-progress-circular size="72" color="primary" indeterminate></v-progress-circular>
        </v-layout>
        <v-list v-else subheader style="overflow-y: scroll; height: 300px;">
            <template v-for="(movie, index) in resultUi">
                <v-divider v-if="movie.divider" :inset="movie.inset" :key="index">
                </v-divider>

                <v-list-tile v-else :key="movie.id" avatar @click="doSelect(index)">


                    <v-list-tile-avatar tile>
                        <img :src="movie.Poster ? movie.Poster : '../img/unknown.png' ">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title v-html="movie.Title"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="`Year: ${movie.Year}`"></v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-list>

        <v-btn mt-5 v-if="loading" flat @click="doCancel">Stop Search</v-btn>
        <v-btn v-if="debug" color="debug" class="white--text" @click="sendHeartBeat">HB</v-btn>
    </div>
</template>

<script>

    import {store} from "../../../core/redux/redux.js";
    import {
        triggerMovieSearch,
        triggerMovieSearchStop,
        selectMovie,
        sendHeartBeat
    } from "../../../core/redux/actionCreators.js";

    export default {
        data: () => ({
            debug: false,
            query: '',
            queryModified: false,
            loading: false,
            result: [],
            resultUi: [],
            divider: {divider: true, inset: true}
        }),

        created: function () {
            store.subscribe(() => {
                this.debug = store.getState().debug.app;

                if (!this.queryModified) {
                    this.query = store.getState().movieSearch.query;
                }

                this.loading = store.getState().movieSearch.isLoading;

                if (this.result !== store.getState().movieSearch.result) {
                    this.result = store.getState().movieSearch.result;
                    this.resultUi = this.result.reduce((acc, c) => [...acc, c, this.divider], []);
                }
            });
        },

        mounted: function () {
            this.sendHeartBeat();
        },

        methods: {
            doSearch() {
                store.dispatch(triggerMovieSearch(this.query));
            },

            doQueryModified() {
                this.queryModified = true;
            },

            doSelect(index) {
                let selectedIndex = this.result.findIndex(x => x.id === this.resultUi[index].id);
                store.dispatch(selectMovie(selectedIndex));
                console.log(`Selected Movie: ${JSON.stringify(this.result[selectedIndex])}`);
                this.$emit('stepper-content-select');
            },

            doCancel() {
                store.dispatch(triggerMovieSearchStop());
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }
</script>