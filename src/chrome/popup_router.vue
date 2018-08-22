<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

<template>
    <v-app>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </v-app>
</template>

<script>

    import {store} from "../core/redux/redux.js";
    import {sendHeartBeat} from "../core/redux/actionCreators.js";

    export default {
        name: "PopupRouter",
        created() {
            this.$router.push('/home');
            store.ready().then(() => {
                store.dispatch(sendHeartBeat());
            });
        }
    };
</script>