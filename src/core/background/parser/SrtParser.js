var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
}

srtPlayer.SRTParser = srtPlayer.SRTParser || (function () {

        var console2 = {
            log:()=>{}
        }; //console;
        function parse(rawSrt) {
            console2.log("start parsing");

            var srtRawLine = rawSrt.split(/\n/);
            var isNewEntry = true;
            var isTimeLine = true;
            var currentId = -1;
            var currentTimeLine = -1;
            var currentText = "";
            var result = [];
            srtRawLine.forEach((value) => {
                console2.log("current element:" + value);

                if (isNewEntry === true) {
                    currentId = parseInt(value, 10);
                    if (isNaN(currentId)) {
                        console2.log("Line is NaN, skip line");
                        return;
                    }
                    console2.log("id: " + currentId);
                    isNewEntry = false;
                } else {
                    if (isTimeLine === true) {
                        console2.log("timeline:" + value);
                        currentTimeLine = extractTimeLine(value);
                        console2.log("parsed timeline:");
                        console2.log(currentTimeLine);
                        isTimeLine = false;
                        return;
                    }

                    if (isBlank(value) === false) {
                        console2.log("subtitle line:" + value);
                        currentText += value;
                        console2.log("concat subtitle line:" + currentText);
                        return;
                    }
                    result.push(createSubtitleEntry(currentId, currentTimeLine, currentText));

                    isNewEntry = true;
                    isTimeLine = true;
                    currentText = "";
                }
            });
            console2.log("parsing done. entry size: " + result.length);
            return result;
        }

        function isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }

        function createSubtitleEntry(id, timeline, text) {
            return {
                'id': id,
                'from': timeline.from,
                'to': timeline.to,
                'text': text
            };
        }

        //maybe exclude from this function for easy replace of parser strategy
        function extractTimeLine(value) {
            var valArr = value.split("-->");
            var leftSide = valArr[0];
            var rightSide = valArr[1];

            return {
                'from': timestampToMillisecond(leftSide),
                'to': timestampToMillisecond(rightSide)
            };
        }

        function timestampToMillisecond(value) {
            var valArr = value.split(':');
            var hours = valArr[0];
            var minutes = valArr[1];
            var seconds = valArr[2];
            var milliseconds = parseInt(seconds.replace(",", ""), 10);
            milliseconds += minutes * 60 * 1000;
            milliseconds += hours * 60 * 60 * 1000;
            return milliseconds;
        }

        return {parse: parse};
    });


