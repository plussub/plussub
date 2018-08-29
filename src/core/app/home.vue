<template>
    <div>
        <v-toolbar dark color="primary">

            <v-toolbar-title class="white--text">
                <v-avatar>
                    <img :src="logo">
                </v-avatar>
            </v-toolbar-title>

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

            <v-btn icon>
                <v-icon @click="doOpenOption">fa-cog</v-icon>
            </v-btn>

        </v-toolbar>
        <v-container>
            <v-layout>
                <v-flex xs12 sm6 offset-sm3>
                    <v-card>
                        <v-layout>
                            <v-flex xs7>
                                <v-card-title primary-title>
                                    <div>
                                        <div class="headline">{{ title }}</div>
                                        <!--&lt;!&ndash;TODO conditional-->
                                        <!--<div>Foster the People</div>&ndash;&gt;-->
                                        <!--<div>(2014)</div>-->
                                    </div>
                                </v-card-title>
                            </v-flex>

                            <v-flex xs5>
                                <v-card-media
                                        :src="img"
                                        height="125px"
                                        contain>
                                </v-card-media>
                            </v-flex>
                        </v-layout>
                        <v-divider light></v-divider>
                        <v-card-actions class="xs-3">
                            <v-spacer></v-spacer>
                            <v-btn flat :disabled="subtitleId === -1" @click="doRemoveSubtitle">Remove Subtitle</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>

            <v-layout mt-1>
                <v-flex xs12 sm6 offset-sm3>
                    <v-card>
                        <v-layout>
                            <v-flex xs12>
                                <v-card-title primary-title>
                                    <v-text-field label="Offset"
                                                  type="number"
                                                  v-model="offsetTime"
                                                  @input="doOffsetModified"
                                                  suffix="ms"
                                                  :append-icon="'fa-arrows-alt-h'"
                                                  @click:append="doOffsetTime">
                                    </v-text-field>
                                </v-card-title>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {store} from "../../core/redux/redux.js";
    import {
        openOptionPage,
        sendHeartBeat,
        removeSubtitle,
        removeMovieInfo,
        setOffsetTime,
        parseRawSubtitle
    } from "../../core/redux/actionCreators.js";

    const emptyImg = '../img/empty.png';
    const unknownImg = '../img/unknown.png';


    export default {
        name: 'home-view',
        data: () => ({
            logo: '../icons/plussub128.png',
            img: emptyImg,
            subtitleId: -1,
            movieInfoId: -1,
            title: '',
            offsetTime: 25,
            offsetTimeModified: false
        }),

        created: function () {
            store.subscribe(() => {
                let subtitle = store.getState().subtitle;
                this.subtitleId = subtitle.id;
                if (!this.offsetTimeModified) {
                    this.offsetTime = subtitle.offsetTime;
                }

                let movieInfo = store.getState().movieInfo;
                this.movieInfoId = movieInfo.id;
                if (this.movieInfoId === -1) {
                    this.img = emptyImg;
                    this.title = ''
                } else {
                    this.title = movieInfo.title;
                    console.log(this.title);
                    this.img = movieInfo.poster ? movieInfo.poster : unknownImg;
                }


            })
        },

        mounted: function () {
            this.sendHeartBeat();
        },

        methods: {
            doOpenOption() {
                store.dispatch(openOptionPage('open'));
            },

            doRemoveSubtitle() {
                store.dispatch(removeSubtitle());
                store.dispatch(removeMovieInfo());
            },
            doOffsetModified() {
                this.offsetTimeModified = true;
            },

            doOffsetTime() {
                store.dispatch(setOffsetTime(parseInt(this.offsetTime, 10)));

                //todo: move to parser service?
                if (store.getState().subtitle.id !== -1) {
                    store.dispatch(parseRawSubtitle(store.getState().subtitle.raw));
                }
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    };

</script>