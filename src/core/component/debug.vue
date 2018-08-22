<template>
    <div>
        <h1>redux state</h1>
        <pre>{{ reduxState }}</pre>
    </div>
</template>
<script>
    import {store} from "../redux/redux.js";

    export default {
        name: 'debug',
        data: function () {
            return {
                reduxState: '{}'
            }
        },
        created() {
            store.subscribe(() => {
                this.reduxState = JSON.stringify(store.getState(), null, 2);
            });
        }
    };

</script>