"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// import {Group, Surface, Text, Shape, Transform, LinearGradient, ClippingRectangle } from "react-art";
/** Given a text string and a maxium width, create several lines each no longer than width */
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
/** An attempt to create a text wrapped component for React Art.
 *  Text will written in the middle of the specified rectangle.
 */
exports.WrappedSvgText = function (props) {
    var filter = props.filter, top = props.top, text = props.text, height = props.height, width = props.width, center = props.center, x = props.x, y = props.y, lineHeight = props.lineHeight, fontWidth = props.fontWidth;
    var texts = wrapText(text, Math.round(width / fontWidth * 1.7));
    var adjustedLineHeight = Math.min(lineHeight, height / texts.length);
    var yLine1 = top ? 0 : height / 2 - (texts.length / 2 * adjustedLineHeight);
    var textColor = props.textColor || "black";
    return (React.createElement("g", null,
        React.createElement("defs", null,
            React.createElement("clipPath", { key: "rect", id: "clip" + text },
                React.createElement("rect", { y: y, x: x - (center ? (width / 2) : 0), width: width, height: height }))),
        texts.map(function (str, i) { return React.createElement("text", {
            key: "text" + i,
            y: y + yLine1 + adjustedLineHeight * i,
            x: x + 0,
            textAnchor: center ? "middle" : "start",
            alignmentBaseline: "hanging",
            width: width - 8,
            height: adjustedLineHeight,
            fontWeight: props.fontWeight,
            fontFamily: props.fontFamily || "Arial",
            fontSize: fontWidth,
            fill: textColor,
            style: {
                userSelect: "none",
                cursor: "default",
            },
            filter: filter,
            clipPath: "url(#clip" + text + ")",
        }, str); })));
};
//# sourceMappingURL=svg-components.js.map