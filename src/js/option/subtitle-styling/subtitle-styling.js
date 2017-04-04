/**
 * Created by stefa on 19.03.2017.
 */

class SubtitleStylingElement extends Polymer.Element {
    static get is() {
        return "subtitle-styling";
    }

    static get properties() {
        return {
            css:  {
                type:String,
                notify:true
            }
        }
    }

    ready() {
        super.ready();
    }

    tidyUp(){
        this.$.subtitleCssArea.value = css_beautify(this.$.subtitleCssArea.value);
    }
}
customElements.define(SubtitleStylingElement.is, SubtitleStylingElement);
