<template>
    <div>
        <v-toolbar dark color="primary">

            <router-link to="home">
                <v-btn icon>
                    <v-icon>fa-arrow-left</v-icon>
                </v-btn>
            </router-link>

            <v-toolbar-title class="white--text">+Sub File Selection</v-toolbar-title>
        </v-toolbar>

        <v-container>
            <v-card>
                <v-card-title primary-title>
                    <div class="headline">Select a subtitle file</div>
                    <div>Load subtitle File. *.vtt and *.srt are supported.</div>
                </v-card-title>
                <v-card-actions>
                    <input type="file" @change="fileSelected" ref="fileInput">
                </v-card-actions>
            </v-card>
        </v-container>
        <debug></debug>
    </div>
</template>


<script>
    import Debug from '../component/debug.vue';
    import {store} from '../redux/redux.js';
    import {setMovieInfo, parseRawSubtitle} from '../redux/actionCreators.js';

    export default {
        name: 'file-view',
        components: {
            Debug,
        },
        methods: {
            fileSelected() {
                const reader = new FileReader();
                console.log(this.$refs["fileInput"]);
                reader.readAsText(this.$refs["fileInput"].files[0]);
                reader.onload = () => {
                    const filename = this.$refs["fileInput"].files[0].name;
                    console.log(`file loaded: ${filename}`);

                    store.dispatch(setMovieInfo({
                        title: filename,
                        src: "File selection"
                    }));

                    store.dispatch(parseRawSubtitle(reader.result));
                };
            }
        }
    };

</script>