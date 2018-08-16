/**
 * Created by stefa on 19.03.2017.
 */

class AdvancedSettingsElement extends Polymer.Element {
    static get is() {
        return "advanced-settings";
    }

    ready() {
        super.ready();
    }

    static get properties() {
        return {
            settings: {
                type: Object,
                notify:true,
                value:()=> {
                    return {
                        enableDebugConsole:false
                    };
                }
            }
        }
    }

}
customElements.define(AdvancedSettingsElement.is, AdvancedSettingsElement);
