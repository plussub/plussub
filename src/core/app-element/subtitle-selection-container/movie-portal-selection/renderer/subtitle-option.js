/**
 * Created by sonste on 28.12.2016.
 */
class PlussubSubtitleOptionElement extends Polymer.Element {
    static get is() {
        return "subtitle-option";
    }

    static get properties() {
        return {
            item: {
                type: Object,
                value: () => {
                    return {};
                },
            }
        }
    }
}

customElements.define(PlussubSubtitleOptionElement.is, PlussubSubtitleOptionElement);