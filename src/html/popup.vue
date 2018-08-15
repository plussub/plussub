// app.vue
<style>
    .red {
        color: #f00;
    }
</style>

<template>
    <div>
        <h1 class="red">{{msg}}</h1>
        <!--<button-counter></button-counter>-->
    </div>
</template>

<script>

    export default {
        data: () => ({
            msg: 'Hello www!'
        })
    };

    // import ButtonCounter from '.buttonCounter.vue';
    // ../js/node_modules/plussub-core/vue-app/
    // ,
    // components: {
    //     ButtonCounter
    // }
</script>