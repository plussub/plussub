/**
 * Created by stefa on 19.03.2017.
 */

class SubtitleStylingElement extends Polymer.Element {
    static get is() {
        return "subtitle-styling";
    }

    async ready() {
        super.ready();
    }

    static get properties() {
        return {
            css:  {
                type:String,
                notify:true
            }
        }
    }

    tidyUp(){
        this.$.subtitleCssArea.value = css_beautify(this.$.subtitleCssArea.value);
    }
}
customElements.define(SubtitleStylingElement.is, SubtitleStylingElement);
