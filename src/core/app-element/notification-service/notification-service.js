/**
 * Created by stefa on 06.03.2017.
 */
class PlussubNotificationServiceElement extends Polymer.Element {
    static get is() {
        return "notification-service";
    }

    ready() {
        super.ready();

        let previousErrors = srtPlayer.Redux.getState().errors;
        srtPlayer.Redux.subscribe(() => {
            let errors = srtPlayer.Redux.getState().errors;
            if(previousErrors.length !== errors.length && errors.length>0){
                const newErrorsCnt = errors.length-previousErrors.length;
                this.show({
                    msg:errors.slice(previousErrors.length,errors.length).reduce((c,p)=> c.message+"\n"+p.message ,{message:""})
                });
            }
            previousErrors = errors;
        });
    }

    static get properties() {
        return {
            _placeholderMessage: {
                type: String,
                value: '<placeholder>'
            },
            _currentMessage: {
                type: String,
                value: 'intial'
            },
            duration: {
                type: Number,
                value: 3000
            }
        }
    }

    show(payload) {
        this._currentMessage = payload.msg;
        this.$.toast.show();
    }

    onToastClose() {
        this._currentMessage = this._placeholderMessage;
    }
}

customElements.define(PlussubNotificationServiceElement.is, PlussubNotificationServiceElement);
