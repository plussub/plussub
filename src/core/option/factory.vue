<template>
    <v-layout mt-5>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    ATTENTION
                </v-card-title>
                <v-card-text>
                    With this button, all your changes are lost and factory default will be recovered.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" @click="resetAll" class="white--text">RESET TO FACTORY SETTINGS</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>

    import {store} from "../../core/redux/redux.js";
    import {resetAll} from "../../core/redux/actionCreators.js";

    export default {
        methods: {
            resetAll() {
                store.dispatch(resetAll());
            }
        }
    }

</script>