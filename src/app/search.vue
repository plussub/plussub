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
                    <v-stepper-step :complete="e1 > 1" step="1">Search a movie</v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="e1 > 2" step="2">Select a language</v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="e1 > 2" step="3">Pick a subtitle</v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="e1 > 3" step="4">Download result page</v-stepper-step>

                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <movie-search v-on:stepper-content-select="doSelect"></movie-search>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <language-selection v-on:stepper-content-select="doSelect"></language-selection>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <subtitle-search v-on:stepper-content-select="doSelect" :has-focus="e1 === 3"></subtitle-search>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <subtitle-download v-on:stepper-content-select="doSelect" :has-focus="e1 === 4"></subtitle-download>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-container>
        <error-notification></error-notification>
    </div>
</template>

<script>
    import MovieSearch from './search/movie.vue';
    import LanguageSelection from './search/language.vue';
    import SubtitleSearch from './search/subtitle.vue';
    import SubtitleDownload from './search/download.vue';

    import ErrorNotification from '../component/error-notification.vue';

    export default {
        data: () => ({
            e1: 0,
        }),

        methods: {
            doSelect() {
                this.e1++;
            }
        },
        components: {
            MovieSearch,
            LanguageSelection,
            SubtitleSearch,
            SubtitleDownload,
            ErrorNotification
        }
    }
</script>

