/**
 * Created by sonste on 28.12.2016.
 */
class PlussubLanguageOptionElement extends Polymer.Element {
    static get is() {
        return "language-option";
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

customElements.define(PlussubLanguageOptionElement.is, PlussubLanguageOptionElement);