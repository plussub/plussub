// Define a new component called button-counter

<template>
    <button v-on:click="count++">You cdddlicked me {{ count }} times.</button>
</template>

<script>
    export default {
        data: () => ({
            count: 0
        })
    };
</script>