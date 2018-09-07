<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .1s ease;
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

    import {store} from "../redux/redux.js";
    import {sendHeartBeat} from "../redux/actionCreators.js";

    export default {
        name: "PopupRouter",
        created() {
            this.$router.push('/home');
            store.ready().then(() => store.dispatch(sendHeartBeat()));
        }
    };
</script>