<template>

    <v-snackbar v-model="showSnackbar" :bottom="true" :timeout="timeout">
        {{ prevErrors.length>0 ? prevErrors[prevErrors.length-1].message : '' }}
    </v-snackbar>
</template>

<script>

    import {store} from "../redux/redux.js";

    export default {
        data: () => ({
            timeout: 3000,
            showSnackbar: false,
            prevErrors: [],
            init: true
        }),
        created: function () {
            store.subscribe(() => {
                let errors = store.getState().errors;
                if (this.prevErrors.length !== errors.length && errors.length > 0) {
                    this.prevErrors = [...errors];
                    if (this.init) {
                        this.init = false;
                        return;
                    }
                    this.showSnackbar = true;
                    console.warn(this.prevErrors[this.prevErrors.length - 1])
                }
            });
        }
    }
</script>