<template>
    <div>
        <v-toolbar dark color="primary">

            <v-toolbar-title class="white--text">+Sub</v-toolbar-title>

            <v-spacer></v-spacer>

            <router-link to="search">
                <v-btn icon>
                    <v-icon>fa-search</v-icon>
                </v-btn>
            </router-link>

            <router-link to="file">
                <v-btn icon>
                    <v-icon>fa-upload</v-icon>
                </v-btn>
            </router-link>

        </v-toolbar>
        <v-container>
            <v-layout>
                <v-flex xs12 sm6 offset-sm3>
                    <v-card>
                        <v-layout>
                            <v-flex xs7>
                                <v-card-title primary-title>
                                    <div>
                                        <div class="headline">Supermodel</div>
                                        <div>Foster the People</div>
                                        <div>(2014)</div>
                                    </div>
                                </v-card-title>
                            </v-flex>

                            <v-flex xs5>
                                <v-card-media
                                        src="data:image/png;base64,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"
                                        height="125px"
                                        contain>
                                </v-card-media>
                            </v-flex>
                        </v-layout>
                        <v-divider light></v-divider>
                        <v-card-actions class="xs-3">
                            <v-spacer></v-spacer>
                            <v-btn flat>Search new subtitle</v-btn>
                            <v-btn flat>Upload .srt/.vtt file</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>

            <v-layout mt-2>
                <v-flex xs12 sm6 offset-sm3>
                    <v-card>
                        <v-layout>
                            <v-flex xs12>
                                <v-card-title primary-title>
                                        <v-text-field label="Offset" suffix="ms"></v-text-field>
                                </v-card-title>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <redux-state></redux-state>

    </div>
</template>

<script>
    import ReduxState from '../component/redux-state.vue';

    export default {
        name: 'home-view',
        components: {
            ReduxState
        }
    };

</script>