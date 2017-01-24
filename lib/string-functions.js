"use strict";
function wrapText(text, maxWidth) {
    var index = 0, nextIndex = 0;
    var ret = [];
    if (!text) {
        return [];
    }
    do {
        if (text.length >= (index + maxWidth)) {
            nextIndex = text.lastIndexOf(" ", (index + maxWidth));
        }
        if (((index + maxWidth) > text.length) || (nextIndex < 0) || (nextIndex <= index)) {
            return ret.concat([text.substr(index).trim()]);
        }
        ret.push(text.substring(index, nextIndex).trim());
        index = nextIndex;
    } while (true);
}
exports.wrapText = wrapText;
//# sourceMappingURL=string-functions.js.map