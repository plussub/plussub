<template>
    <div>
        <v-layout v-if="loading" justify-center style="height: 300px;">
            <v-progress-circular size="72" color="primary" indeterminate></v-progress-circular>
        </v-layout>
        <v-layout v-if="!loading" justify-center style="height: 300px;">
            <v-icon size="72" color="green">fa-check</v-icon>
        </v-layout>

        <v-btn mt-5 v-if="loading" flat @click="doCancel">Stop Search</v-btn>
        <v-btn v-if="debug" color="debug" class="white--text" @click="sendHeartBeat">HB</v-btn>
    </div>
</template>


<script>

    import {store} from "../../../core/redux/redux.js";
    import {
        triggerSubtitleDownload,
        triggerSubtitleDownloadStop,
        sendHeartBeat
    } from "../../../core/redux/actionCreators.js";

    export default {
        data: () => ({
            debug: false,
            loading: true
        }),
        props: ['hasFocus'],
        created: function () {
            store.subscribe(() => {
                // this.loading = store.getState().subtitleDownload.isLoading;
                if(this.hasFocus){
                //    todo if download fin:
                //     setTimeout(() => this.$router.push('/home'), 2500);
                }
            });
        },

        mounted: function () {
            this.sendHeartBeat();
        },

        watch: {
            hasFocus: function (hasFocus) {
                if (hasFocus) {
                    this.doDownload();
                }
            }
        },

        methods: {

            doDownload() {
                //timeout needed because sync between subtitle selection and background redux store
                setTimeout(() => {
                    this.loading = false;
                    let subtitle = store.getState().subtitleSearch.result[ store.getState().subtitleSearch.selected];

                    console.log(`do download sub (${subtitle.MovieName})`);
                    console.log(`download link: ${subtitle.SubDownloadLink}`);

                    store.dispatch(triggerSubtitleDownload(subtitle.SubDownloadLink));
                }, 2000);
            },

            doCancel() {
                store.dispatch(triggerSubtitleDownloadStop());
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }
</script>