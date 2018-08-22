const console2 = {
    log: () => {
    }
}; //console;

const parse = (rawSrt) => {
    console2.log("start parsing");

    const srtRawLine = rawSrt.split(/\n/);
    let isNewEntry = true;
    let isTimeLine = true;
    let currentId = -1;
    let currentTimeLine = -1;
    let currentText = "";
    const result = [];
    srtRawLine.forEach((value) => {
        console2.log("current element:" + value);

        if (isNewEntry === true) {
            currentId = parseInt(value, 10);
            if (isNaN(currentId)) {
                console2.log("Line is NaN, skip line");
                return;
            }
            console2.log(`id:  ${currentId}`);

            isNewEntry = false;
        } else {
            if (isTimeLine === true) {
                console2.log(`timeline: ${value}`);
                currentTimeLine = extractTimeLine(value);
                console2.log(`parsed timeline: ${currentTimeLine}`);
                isTimeLine = false;
                return;
            }

            if (isBlank(value) === false) {
                console2.log(`subtitle line: ${value}`);
                currentText += value;
                console2.log(`concat subtitle line: ${currentText}`);
                return;
            }
            result.push(createSubtitleEntry(currentId, currentTimeLine.from, currentTimeLine.to, currentText));

            isNewEntry = true;
            isTimeLine = true;
            currentText = "";
        }
    });
    console2.log(`parsing done. entry size: ${result.length}`);
    return result;
};

const isBlank = (str) => (!str || /^\s*$/.test(str));
const createSubtitleEntry = (id, from, to, text) => ({
    id,
    from,
    to,
    text
});

//maybe exclude from this function for easy replace of parser strategy
const extractTimeLine = (value) => {
    let [leftSide, rightSide] = value.split("-->");

    return {
        'from': timestampToMillisecond(leftSide),
        'to': timestampToMillisecond(rightSide)
    };
};

function timestampToMillisecond(value) {
    const [hours, minutes, seconds] = value.split(':');
    let milliseconds = parseInt(seconds.replace(",", ""), 10);
    milliseconds += minutes * 60 * 1000;
    milliseconds += hours * 60 * 60 * 1000;
    return milliseconds;
}

export {parse};
