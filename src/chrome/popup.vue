<style>
    .red {
    color: #f00;
    }
</style>

<template>
    <v-app>
        <plus-sub-app></plus-sub-app>
    </v-app>

</template>

<script>
    import PlusSubApp from '../core/app/app.vue';

    export default {
        data: () => ({
            msg: 'Hello www!'
        }),
        components: {
            PlusSubApp
        }
    };
</script>