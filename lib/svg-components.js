"use strict";
var React = require("react");
// import {Group, Surface, Text, Shape, Transform, LinearGradient, ClippingRectangle } from "react-art";
var string_functions_1 = require("./string-functions");
/** An attempt to create a text wrapped component for React Art.
 *  Text will written in the middle of the specified rectangle.
 */
exports.WrappedSvgText = function (props) {
    var text = props.text, height = props.height, width = props.width, center = props.center, x = props.x, y = props.y, lineHeight = props.lineHeight, fontWidth = props.fontWidth;
    var texts = string_functions_1.wrapText(text, Math.round(width / fontWidth * 1.7));
    var adjustedLineHeight = Math.min(lineHeight, height / texts.length);
    var yLine1 = height / 2 - (texts.length / 2 * adjustedLineHeight);
    var textColor = props.textColor || "black";
    return (React.createElement("g", null,
        React.createElement("defs", null,
            React.createElement("clipPath", { key: "rect", id: "clip" + text },
                React.createElement("rect", { y: y, x: x, width: width, height: height }))),
        texts.map(function (str, i) { return React.createElement("text", {
            key: "text" + i,
            y: y + yLine1 + adjustedLineHeight * i,
            x: x + (center ? (width / 2) : 4),
            textAnchor: center ? "center" : "start",
            alignmentBaseline: "hanging",
            width: width - 8,
            height: adjustedLineHeight,
            fontWeight: props.fontWeight,
            fontFamily: props.fontFamily || "Arial",
            fontSize: fontWidth,
            fill: textColor,
            strokeWidth: 0.5,
            stroke: "black",
            clipPath: "url(#clip" + text + ")",
        }, str); })));
};
//# sourceMappingURL=svg-components.js.map