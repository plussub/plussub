<template>
    <v-layout mt-5>
        <v-flex xs12>
            <v-card>
                <v-layout>
                    <v-flex xs12>
                        <v-card-text>
                            <v-layout>
                                <v-flex xs6>
                                    <v-card>
                                        <v-card-title>Debug settings</v-card-title>
                                        <v-card-text>
                                            <v-switch label="Enable debug on option page" v-model="option"
                                                      @change="setModifiedState"></v-switch>
                                            <v-switch label="Enable debug on app page" v-model="app"
                                                      @change="setModifiedState"></v-switch>
                                            <v-switch label="Enable debug for content script" v-model="content"
                                                      @change="setModifiedState"></v-switch>
                                            <v-switch label="Enable debug for message bridge" v-model="messageBridge"
                                                      @change="setModifiedState"></v-switch>
                                            <v-switch label="Enable debug for redux" v-model="redux"
                                                      @change="setModifiedState"></v-switch>

                                        </v-card-text>
                                        <v-card-actions>
                                            <v-btn flat @click="reset">Reset</v-btn>
                                            <v-btn flat @click="save">Save</v-btn>
                                            <v-btn flat @click="sendHeartBeat">Send Heartbeat</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical xs1></v-divider>
                                </v-flex>
                                <v-flex xs5>
                                    <v-card>
                                        <v-card-title>Redux-State</v-card-title>
                                        <v-card-text>
                                            <redux-state></redux-state>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>

    import ReduxState from '../component/redux-state.vue';
    import {store} from "../redux/redux.js";
    import {sendHeartBeat, setDebugSettings} from "../redux/actionCreators.js";

    export default {
        data: () => ({
            app: false,
            option: false,
            content: false,
            messageBridge: false,
            redux: false,
            inModifiedState: false
        }),
        mounted: function () {
            this.sendHeartBeat();
        },
        created: function () {
            store.subscribe(() => {
                if (this.inModifiedState) {
                    return;
                }
                this.option = store.getState().debug.option;
                this.app = store.getState().debug.app;
                this.content = store.getState().debug.content;
                this.messageBridge = store.getState().debug.messageBridge;
                this.redux = store.getState().debug.redux;
            })
        },
        methods: {
            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            },

            reset() {
                this.inModifiedState = false;
                this.sendHeartBeat();
            },

            save() {
                store.dispatch(setDebugSettings({
                    option: this.option,
                    app: this.app,
                    content: this.content,
                    messageBridge: this.messageBridge,
                    redux: this.redux
                }))
            },

            setModifiedState() {
                this.inModifiedState = true;
            }
        },
        components: {
            ReduxState
        }
    }

</script>