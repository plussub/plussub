<template>
    <div>
        <v-toolbar dark color="primary">

            <router-link to="home">
                <v-btn icon>
                    <v-icon>fa-arrow-left</v-icon>
                </v-btn>
            </router-link>

            <v-toolbar-title class="white--text">Search</v-toolbar-title>
        </v-toolbar>

        <v-container>
            <v-stepper v-model="e1">
                <v-stepper-header>
                    <v-stepper-step :complete="e1 > 1" step="1">Search movie</v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="e1 > 2" step="2">Select language</v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3">Pick subtitle</v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-text-field label="Search a movie title"
                                      clearable
                                      type="text"
                                      v-model="movieSearchQuery"
                                      @input="doMovieSearchQueryModified"
                                      @keyup.enter="doMovieSearch"
                                      @click:clear="doClearMovieSearch">

                            <v-layout slot="append">
                                <v-icon @click="doMovieSearch" size="24">fa-search</v-icon>
                                <v-progress-circular
                                        v-if="movieSearchLoading"
                                        size="24"
                                        color="info"
                                        indeterminate
                                ></v-progress-circular>
                            </v-layout>
                        </v-text-field>

                        <v-list subheader style="overflow-y: scroll; height: 300px;">
                            <template v-for="(movie, index) in movieSearchResultsUi">
                                <v-divider v-if="movie.divider" :inset="movie.inset" :key="index">
                                </v-divider>

                                <v-list-tile v-else :key="movie.id" avatar @click="doSelectMovie(index)">


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

                        <v-btn mt-5 v-if="movieSearchLoading" flat @click="doCancelMovieSearch">Stop Search</v-btn>
                        <v-btn v-if="debug" color="debug" class="white--text" @click="sendHeartBeat">HB</v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="2">

                        <v-text-field label="Filter language"
                                      type="text"
                                      v-model="languageFilter"
                                      @input="doLanguageFilterModified"
                                      :append-icon="'fa-search'"
                                      clearable>
                        </v-text-field>

                        <v-data-table :headers="languageHeaders" :items="iso639List" :search="languageFilter"
                                      hide-actions
                                      style="overflow-y: scroll; height: 300px;">
                            <template slot="items" slot-scope="props">
                                <td @click="doSelectLanguage(props.item)">{{ props.item.iso639Name }}</td>
                                <td @click="doSelectLanguage(props.item)">{{ props.item.iso639 }}</td>
                                <td @click="doSelectLanguage(props.item)">{{ props.item.iso639_2 }}</td>
                            </template>
                        </v-data-table>
                    </v-stepper-content>

                    <v-stepper-content step="3">

                        <v-list style="overflow-y: scroll; height: 300px;">
                            <v-subheader>
                                <v-layout>
                                    <v-flex xs10>Subtitle</v-flex>
                                    <v-flex xs2>
                                        <v-progress-circular v-if="subtitleSearchLoading" size="16" color="info"
                                                             indeterminate
                                        ></v-progress-circular>
                                    </v-flex>
                                </v-layout>
                            </v-subheader>

                            <template v-for="(subtitle, index) in subtitleSearchResult">
                                <v-list-tile :key="subtitle.id" avatar @click="doSelectSubtitle(index)">
                                    <v-list-tile-content>
                                        <v-list-tile-title v-html="subtitle.id"></v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>
                        </v-list>

                        <v-btn mt-5 v-if="subtitleSearchLoading" flat @click="doCancelSubtitleSearch">Stop Search
                        </v-btn>
                        <v-btn v-if="debug" color="debug" class="white--text" @click="sendHeartBeat">HB</v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-container>
    </div>
</template>

<script>


    import {store} from "../../core/redux/redux.js";
    import {
        triggerMovieSearch,
        triggerMovieSearchStop,
        selectMovie,
        selectSubtitleLanguage,
        sendHeartBeat,
        triggerSubtitleSearch
    } from "../../core/redux/actionCreators.js";
    import iso639List from './iso639List.js'

    export default {
        data: () => ({
            e1: 0,
            debug: false,
            movieSearchQuery: '',
            movieSearchQueryModified: false,
            movieSearchLoading: false,
            movieSearchResults: [],
            movieSearchResultsUi: [],
            divider: {divider: true, inset: true},
            iso639List: iso639List,
            languageFilter: '',
            languageFilterModified: false,
            languageHeaders: [
                {text: 'Language', value: 'iso639Name'},
                {text: 'Iso639', value: 'iso639'},
                {text: 'Iso639 (2)', value: 'iso639_2'}
            ],
            languageSelected: '',
            subtitleSearchLoading: false,
            subtitleSearchResult: []
        }),

        created: function () {
            store.subscribe(() => {
                this.debug = store.getState().debug.app;

                if (!this.movieSearchQueryModified) {
                    this.movieSearchQuery = store.getState().movieSearch.query;
                }

                if (!this.languageFilterModified) {
                    this.languageFilter = store.getState().subtitleLanguage.iso639;
                }

                this.movieSearchLoading = store.getState().movieSearch.isLoading;
                this.subtitleSearchLoading = store.getState().subtitleSearch.isLoading;

                if (this.movieSearchResults !== store.getState().movieSearch.result) {
                    this.movieSearchResults = store.getState().movieSearch.result;
                    this.movieSearchResultsUi = this.movieSearchResults.reduce((acc, c) => [...acc, c, this.divider], []);
                }

                if( this.subtitleSearchResult !== store.getState().subtitleSearch.result){
                    this.subtitleSearchResult = store.getState().subtitleSearch.result;
                }
            });
        },

        mounted: function () {
            this.sendHeartBeat();
        },

        watch: {
            e1: function (newVal) {
                if (newVal === 3) {
                    this.doSubtitleSearch();
                }
            }
        },

        methods: {
            doMovieSearch() {
                store.dispatch(triggerMovieSearch(this.movieSearchQuery));
            },

            doMovieSearchQueryModified() {
                this.movieSearchQueryModified = true;
            },

            doClearMovieSearch() {
                this.items = [];
            },

            doSelectMovie(index) {
                this.e1 = 2;
                let selectedIndex = this.movieSearchResults.findIndex(x => x.id === this.movieSearchResultsUi[index].id);
                store.dispatch(selectMovie(selectedIndex));
                console.log(`Selected Movie: ${JSON.stringify(this.movieSearchResults[selectedIndex])}`);
            },

            doCancelMovieSearch() {
                store.dispatch(triggerMovieSearchStop());
            },

            doLanguageFilterModified() {
                this.languageFilterModified = true;
            },

            doSelectLanguage(selected) {
                this.e1 = 3;
                store.dispatch(selectSubtitleLanguage(selected.iso639));
                console.log(`Selected Language: ${selected.iso639}`);
                this.languageSelected = selected.iso639;
            },
            doSubtitleSearch() {
                console.warn('in vue');
                store.dispatch(triggerSubtitleSearch({
                    queryLanguage: this.languageSelected,//async issue: store.getState().subtitleLanguage.iso639,
                    queryTmdbId: store.getState().movieSearch.result[store.getState().movieSearch.selected].id
                }));
            },

            doSelectSubtitle(index) {
                console.log(`subtitle selected: ${index}`)
            },

            doCancelSubtitleSearch() {
                console.warn('cancel')
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }
</script>

