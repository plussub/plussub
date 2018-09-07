<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" fixed app>
            <v-list dense>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon>fa-comment-alt</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title @click="gotoSubtitle">Subtitle</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon>fa-wrench</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title @click="gotoDebug">Debug</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon>fa-industry</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title @click="gotoFactorySettings">Factory Settings</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark color="primary" fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>
                <v-avatar>
                    <img :src="logo">
                </v-avatar>
            </v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center align-center>
                    <v-flex text-xs-center>
                        <router-view></router-view>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import {store} from "../redux/redux.js";
    import {sendHeartBeat} from "../redux/actionCreators.js";

    export default {
        data: () => ({
            drawer: null,
            logo: 'img/plussub128.png'
        }),
        created() {
            this.$router.push('/subtitle');
            store.ready().then(() => store.dispatch(sendHeartBeat()));
        },
        methods: {
            gotoSubtitle() {
                this.$router.push('/subtitle');
            },
            gotoDebug() {
                this.$router.push('/debug');
            },
            gotoFactorySettings() {
                this.$router.push('/factory');
            }
        }
    }
</script>