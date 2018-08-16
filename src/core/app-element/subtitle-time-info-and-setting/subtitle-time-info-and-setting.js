/**
 * Created by sbreitenstein on 23/01/17.
 */
class PlussubSubtitleTimeInfoAndSettingElement extends Polymer.Element {
    static get is() {
        return "subtitle-time-info-and-setting";
    }

    ready() {

        super.ready();

        let previousOffsetTime = NaN;
        srtPlayer.Redux.subscribe(() => {
            this.onVideoTimeUpdate(srtPlayer.Redux.getState().videoMeta.tickInMs);

            let offsetTime = srtPlayer.Redux.getState().subtitle.offsetTime;
            if ((isNaN(previousOffsetTime) || previousOffsetTime !== offsetTime) && !isNaN(offsetTime)) {
                previousOffsetTime = offsetTime;
                this._setOffsetTime(offsetTime);
            }
        });
    }

    static get properties() {
        return {
            delay: {
                type: Number,
                observer: '_delayChanged'
            },
            selected: {
                type: String,
                observer: '_selectedChanged'
            }
        }
    }

    static _normalize(unit) {
        return unit < 10 ? "0" + unit : unit.toString();
    }


    _setOffsetTime(offsetTime) {
        this.selected = offsetTime >= 0 ? "behind" : "ahead";
        this.delay = Math.abs(offsetTime);
    }

    onVideoTimeUpdate(time) {
        if (!this.$) {
            return;
        }

        const currentVideoPoint = moment.duration(time);
        this.$.current.value = PlussubSubtitleTimeInfoAndSettingElement._normalize(currentVideoPoint.hours())
            + ':'
            + PlussubSubtitleTimeInfoAndSettingElement._normalize(currentVideoPoint.minutes())
            + ':'
            + PlussubSubtitleTimeInfoAndSettingElement._normalize(currentVideoPoint.seconds());
    }

    clear() {
        this.delay = 0;
    }


    _selectedChanged() {
        this._delayChanged(this.delay);
    }

    _delayChanged(newVal) {
        if (isNaN(newVal) || newVal === "") {
            return;
        }

        this._debouncer = Polymer.Debouncer.debounce(
            this._debouncer,
            Polymer.Async.timeOut.after(1500),
            () => {
                const multi = this.$.scheduling.selected === 'behind' ? 1 : -1;
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setOffsetTimeForSubtitle(multi * parseInt(newVal, 10)));
            }
        );
    }
}
customElements.define(PlussubSubtitleTimeInfoAndSettingElement.is, PlussubSubtitleTimeInfoAndSettingElement);
