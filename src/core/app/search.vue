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

                                <v-list-tile v-else :key="movie.id" avatar @click="">


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

                        <v-btn mt-5 v-if="movieSearchLoading" flat @click="cancelMovieSearch">Stop Search</v-btn>
                        <v-btn v-if="debug" color="debug" class="white--text" @click="sendHeartBeat">HB</v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card
                                class="mb-5"
                                color="grey lighten-1"
                                height="200px"
                        ></v-card>

                        <v-btn
                                color="primary"
                                @click="e1 = 3"
                        >
                            Continue
                        </v-btn>

                        <v-btn flat>Cancel</v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card
                                class="mb-5"
                                color="grey lighten-1"
                                height="200px"
                        ></v-card>

                        <v-btn
                                color="primary"
                                @click="e1 = 1"
                        >
                            Continue
                        </v-btn>

                        <v-btn flat>Cancel</v-btn>
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
        sendHeartBeat
    } from "../../core/redux/actionCreators.js";

    export default {
        data: () => ({
            e1: 0,
            debug: false,
            movieSearchQuery: '',
            movieSearchQueryModified: false,
            movieSearchLoading: false,
            movieSearchResults: [],
            movieSearchResultsUi: [],
            divider: {divider: true, inset: true}
        }),

        created: function () {
            store.subscribe(() => {
                this.debug = store.getState().debug.app;

                if (!this.movieSearchQueryModified) {
                    this.movieSearchQuery = store.getState().movieSearch.query;
                }

                this.movieSearchLoading = store.getState().movieSearch.isLoading;
                if (this.movieSearchResults !== store.getState().movieSearch.result) {
                    this.movieSearchResults = store.getState().movieSearch.result;
                    this.movieSearchResultsUi = this.movieSearchResults.reduce((acc, c) => [...acc, c, this.divider], []);
                }

                console.log(`debug : ${this.debug}`);
            });
        },

        mounted: function () {
            this.sendHeartBeat();
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

            cancelMovieSearch() {
                store.dispatch(triggerMovieSearchStop());
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }
</script>

