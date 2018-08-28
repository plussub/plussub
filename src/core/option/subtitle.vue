<template>
    <v-layout mt-5>
        <v-flex xs12>
            <v-card>
                <v-layout>
                    <v-flex xs12>
                        <v-card-text>
                            <v-layout>
                                <v-flex xs6>
                                    <v-expansion-panel v-model="panel" expand>
                                        <v-expansion-panel-content>
                                            <div slot="header" class="title">CSS</div>
                                            <v-card>
                                                <v-card-text>
                                                    <v-textarea label="Style" v-model="css"
                                                                @change="cssModified" auto-grow></v-textarea>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-layout>
                                                        <v-flex xs12>
                                                            <v-btn flat @click="doCssReset">Reset</v-btn>
                                                            <v-btn flat @click="doCssPreview">Preview</v-btn>
                                                            <v-btn flat @click="doCssFormat">Format</v-btn>
                                                            <v-btn flat @click="doCssSave">Save</v-btn>
                                                            <v-btn v-if="debug" color="debug" class="white--text"
                                                                   @click="sendHeartBeat">HB
                                                            </v-btn>
                                                            <v-switch v-model="cssAutoPreview"
                                                                      label="Auto-Preview"></v-switch>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-actions>
                                            </v-card>
                                        </v-expansion-panel-content>

                                        <v-expansion-panel-content>
                                            <div slot="header" class="title">Properties</div>
                                            <v-card>
                                                <v-card-text>
                                                    <v-layout row wrap>

                                                        <v-flex xs12>
                                                            <v-layout align-baseline>
                                                                <v-flex xs3>
                                                                    <p class="v-label">Vertical</p>
                                                                </v-flex>
                                                                <v-flex xs9>
                                                                    <v-btn-toggle v-model="vttVertical"
                                                                                  @change="propertiesModified"
                                                                                  mandatory>
                                                                        <v-btn flat value="">Horizontal</v-btn>
                                                                        <v-btn flat value="rl">vertical left</v-btn>
                                                                        <v-btn flat value="lr">vertical right</v-btn>
                                                                    </v-btn-toggle>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-flex>
                                                        <!--todo-->

                                                        <v-flex xs9>
                                                            <v-slider label="Line" v-model="vttLine"
                                                                      step="1"
                                                                      @change="propertiesModified"
                                                                      thumb-label
                                                                      :disabled="vttAutoLine"></v-slider>
                                                        </v-flex>
                                                        <v-flex xs3>
                                                            <v-switch v-model="vttAutoLine"
                                                                      @change="propertiesModified"
                                                                      label="Auto-Line"></v-switch>
                                                        </v-flex>

                                                        <!-- Not supported in chrome
                                                        <v-slider v-model="vttLineAlign" step="10" ticks="always"-->
                                                        <!--tick-size="2"></v-slider>-->

                                                        <v-flex xs9>
                                                            <v-slider label="Position" v-model="vttPosition"
                                                                      step="1"
                                                                      @change="propertiesModified"
                                                                      thumb-label
                                                                      :disabled="vttAutoPosition"></v-slider>
                                                        </v-flex>
                                                        <v-flex xs3>
                                                            <v-switch v-model="vttAutoPosition"
                                                                      @change="propertiesModified"
                                                                      label="Auto-Position"></v-switch>
                                                        </v-flex>

                                                        <!--Not supported in chrome-->
                                                        <!--<v-slider v-model="vttPositionAlign" step="10" ticks="always"-->
                                                        <!--tick-size="2"></v-slider>-->
                                                        <v-flex xs12>
                                                            <v-slider label="Size" v-model="vttSize" step="1"
                                                                      @change="propertiesModified"
                                                                      thumb-label></v-slider>
                                                        </v-flex>

                                                        <v-flex xs12>
                                                            <v-layout align-baseline>
                                                                <v-flex xs3>
                                                                    <p class="v-label">Align</p>
                                                                </v-flex>
                                                                <v-flex xs9>
                                                                    <v-btn-toggle v-model="vttAlign"
                                                                                  @change="propertiesModified"
                                                                                  mandatory>
                                                                        <v-btn flat value="start">Start</v-btn>
                                                                        <v-btn flat value="center">Center</v-btn>
                                                                        <v-btn flat value="end">End</v-btn>

                                                                        <v-btn flat value="left">Left</v-btn>
                                                                        <v-btn flat value="right">Right</v-btn>
                                                                    </v-btn-toggle>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-flex>

                                                    </v-layout>

                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-layout row wrap>
                                                        <v-flex xs12>
                                                            <v-btn flat @click="doPropertiesReset">Reset</v-btn>
                                                            <v-btn flat @click="doPropertiesPreview">Preview</v-btn>
                                                            <v-btn flat @click="doPropertiesSave">Save</v-btn>
                                                            <v-btn v-if="debug" color="debug" class="white--text"
                                                                   @click="sendHeartBeat">HB
                                                            </v-btn>
                                                            <v-switch v-model="propertiesAutoPreview"
                                                                      label="Auto-Preview"></v-switch>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-card-actions>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-flex>
                                <v-flex xs1>
                                    <!--<v-divider vertical xs1></v-divider>-->
                                </v-flex>
                                <v-flex xs6>
                                    <video ref="exampleVideo" preload="auto" loop="" autoplay="" controls="" muted=""
                                           style="width: 100%">
                                        <source v-if="videoUrl" :src="videoUrl" :type="videoType">
                                    </video>
                                    <v-text-field label="PreviewText" v-model="previewText"></v-text-field>
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

    import cssbeautify from 'cssbeautify';
    import {store} from "../../core/redux/redux.js";
    import {sendHeartBeat, changeCss, changeSubtitleProperties} from "../../core/redux/actionCreators.js";

    let formatCss = (css) => cssbeautify(css, {indent: '  ', openbrace: 'separate-line', autosemicolon: true});

    export default {
        data: () => ({
            videoUrl: '../video/testscreen.mp4',
            videoType: 'video/mp4',
            previewText: 'Lorem ipsum dolor sit amet, quo an erant',
            cue: new VTTCue(0, 60, '<c.srtPlayer> Lorem ipsum dolor sit amet, quo an erant </c.srtPlayer>'),
            panel: [true, true],
            cssIsModified: false,
            css: formatCss('::cue(.srtPlayer){ background-color: red; color: white; font-size: 20px;}'),
            cssAutoPreview: true,
            vttVertical: 'lr',
            vttLine: 1,
            vttAutoLine: false,
            vttPosition: 1,
            vttAutoPosition: false,
            vttAlign: 'center',
            vttSize: 1,
            propertiesAutoPreview: true,
            debug: false
        }),

        watch: {
            previewText: function (newVal, oldVal) {
                this.cue.text = `<c.srtPlayer>${newVal}</c.srtPlayer>`;
            }
        },

        created: function () {
            store.subscribe(() => {
                let optionState = store.getState().option;
                let debugState = store.getState().debug;
                if (this.css !== optionState.css && !this.cssIsModified) {
                    this.css = optionState.css;
                    this.doCssPreview();
                }
                this.debug = debugState.option;

                if (!this.propertiesIsModified) {
                    this.vttVertical = optionState.subtitleVertical;
                    if (optionState.subtitlePosition === 'auto') {
                        this.vttAutoPosition = true;
                    } else {
                        this.vttPosition = optionState.subtitlePosition;
                    }
                    if (optionState.subtitleLine === 'auto') {
                        this.vttAutoLine = true;
                    } else {
                        this.vttLine = optionState.subtitleLine;
                    }
                    this.vttAlign = optionState.subtitleAlign;
                    this.vttSize = optionState.subtitleSize;

                    this.doPropertiesPreview();
                }
            })
        },

        mounted: function () {
            console.log('subtitle view mounted');
            this.replaceCueInVideo();
            this.createStyleElement();
            this.sendHeartBeat();
        },

        methods: {
            createStyleElement() {
                if (document.querySelector('#customSubCss')) {
                    return;
                }

                let el = document.createElement("Style");
                el.setAttribute('id', 'customSubCss');
                el.textContent = this.css;
                document.querySelector('body').appendChild(el);
            },

            replaceCueInVideo() {
                //use removeCue fn instead new texttrac
                let video = this.$refs['exampleVideo'];
                Array.from(video.textTracks).filter(e => e.label.startsWith("srtPlayer")).forEach(track => track.mode = "hidden");

                let track = video.addTextTrack('subtitles', `srtPlayer ${parseInt(Math.random() * 100)}`, "en");
                track.addCue(this.cue);
                track.mode = 'showing';
            },

            doCssPreview() {
                document.querySelector('#customSubCss').textContent = this.css;
                this.$refs['exampleVideo'].focus();
                this.$refs['exampleVideo'].blur();
            },

            doCssFormat() {
                this.css = formatCss(this.css);
            },

            doCssSave() {
                store.dispatch(changeCss(formatCss(this.css)));
            },

            doCssReset() {
                this.cssIsModified = false;
                this.css = store.getState().option.css;
            },

            cssModified() {
                this.cssIsModified = true;
                if (this.cssAutoPreview) {
                    this.doCssPreview();
                }
            },

            doPropertiesReset() {
                this.propertiesIsModified = false;

                let optionState = store.getState().option;
                this.vttVertical = optionState.subtitleVertical;
                if (optionState.subtitlePosition === 'auto') {
                    this.vttAutoPosition = true;
                } else {
                    this.vttPosition = optionState.subtitlePosition;
                }
                if (optionState.subtitleLine === 'auto') {
                    this.vttAutoLine = true;
                } else {
                    this.vttLine = optionState.subtitleLine;
                }
                this.vttAlign = optionState.subtitleAlign;
                this.vttSize = optionState.subtitleSize;

            },

            doPropertiesPreview() {
                Object.assign(this.cue, {
                    vertical: this.vttVertical,
                    line: this.vttAutoLine ? 'auto' : this.vttLine,
                    position: this.vttAutoPosition ? 'auto' : this.vttPosition,
                    align: this.vttAlign,
                    size: this.vttSize
                });
            },

            propertiesModified() {
                console.log('vtt properties modified');
                this.propertiesIsModified = true;
                if (this.propertiesAutoPreview) {
                    this.doPropertiesPreview();
                }
            },

            doPropertiesSave() {
                store.dispatch(changeSubtitleProperties({
                    subtitleVertical: this.vttVertical,
                    subtitleLine: this.vttAutoLine ? 'auto' : this.vttLine,
                    subtitlePosition: this.vttAutoPosition ? 'auto' : this.vttPosition,
                    subtitleAlign: this.vttAlign,
                    subtitleSize: this.vttSize
                }));
            },

            sendHeartBeat() {
                store.dispatch(sendHeartBeat());
            }
        }
    }

</script>
