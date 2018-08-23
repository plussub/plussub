import {subscribe, dispatch, getState} from "../../redux/redux.js";
import {parsedSubtitle} from "../../redux/actionCreators.js";
import {parse} from "./SRTParser.js";

class ParserService {
    constructor() {
        this.unsubscribe = subscribe(() => {
            let {
                raw,
                parsed,
                pastOffsetTime,
                offsetTime,
                offsetTimeApplied
            } = getState().subtitle;
            if (raw.length > 0 && parsed.length === 0) {
                try {
                    this.parse({raw, offsetTime});
                } catch (e) {
                    console.warn(e);
                    return dispatch(parsedSubtitle({
                        message: `Parsing failed: ${e}`,
                        src: "parserService"
                    }, true));
                }
            }

            if (!offsetTimeApplied) {
                this.applyOffset(pastOffsetTime, offsetTime, parsed);
            }
        });

        console.log("ParserService ready");
    }

    applyOffset({pastOffsetTime, offsetTime, toSubtitle}) {
        let subtitleWithOffset = toSubtitle.map(e => (
            {...e, from: e.from - pastOffsetTime + offsetTime, to: e.to - pastOffsetTime + offsetTime}
        ));

        dispatch(parsedSubtitle(subtitleWithOffset));
    }

    parse({raw, offsetTime = 0}) {
        let subtitle = parse(raw).map((e) => ({
            ...e, from: e.from + offsetTime, to: e.to + offsetTime
        }));
        dispatch(parsedSubtitle(subtitle));
    }

    shutdown() {
        this.unsubscribe();
    }
}

export default new ParserService();