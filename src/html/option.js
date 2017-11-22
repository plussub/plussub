/**
 * Created by sonste on 20.07.2017.
 */
HTMLImports.whenReady(function() {
    class MainDocumentElement extends Polymer.Element {

        ready(){
            srtPlayer.Redux.store.ready().then(()=>{
                let option = srtPlayer.Redux.store.getState().option;
                this.css = option.css;
                Object.assign(this.cue,option.subtitleProperties);
                this.advancedSettingsObj ={
                    enableDebugConsole: srtPlayer.Redux.getState().debug.enableDebugConsole
                };

                ["line","position","size","align", "vertical"].forEach((path)=> this.$.subtitlePosition.notifyPath(`cue.${path}`));
                Object.keys(this.advancedSettingsObj).forEach((path)=> this.$.advancedSettings.notifyPath(`advancedSettingsObj.${path}`));

            });

            super.ready();
            // setTimeout(()=> this.$.option.load(),1000);
        }

        static get is() { return 'main-document-element'; }

        static get properties() {
            return {
                advancedSettingsObj:{
                    type: Object,
                    value: ()=>{
                        return {hallo:"ext"};
                    }
                },

                cue: {
                    type: Object,
                    value:()=> {
                        let cue = new VTTCue(0, 60, "<c.srtPlayer> value </c.srtPlayer>");
                        return Object.assign(cue,{
                            position:3,
                            line:100,
                            size:100
                        })
                    }
                },
                css: {
                    type: String,
                    value: () => {
                        var customSubtitleCss = '::cue(.srtPlayer) \
                    {\
                        background-color:green;\
                    }';
                        return css_beautify(customSubtitleCss);
                    }
                }

            }
        }
    }
    window.customElements.define(MainDocumentElement.is, MainDocumentElement);
});
