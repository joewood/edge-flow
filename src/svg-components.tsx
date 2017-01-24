import React = require("react");
// import {Group, Surface, Text, Shape, Transform, LinearGradient, ClippingRectangle } from "react-art";
import { wrapText } from "./string-functions";


/** An attempt to create a text wrapped component for React Art.
 *  Text will written in the middle of the specified rectangle.
 */
export const WrappedSvgText = (props: {
    text: string;
    /** Left coordinate */
    x: number;
    /** Top coordinate */
    y: number;
    /** Width of rectangle to write text */
    width: number;
    /** Height of rectangle to write text */
    height: number;
    center?: boolean;
    /** Line-height to write text (for multiple lines) */
    lineHeight: number;
    /** Average width of font */
    fontWidth: number;
    fontFamily?: string;
    fontWeight?: number;
    textColor?: string;
}) => {
    const {text, height, width, center, x, y, lineHeight, fontWidth} = props;
    const texts = wrapText(text, Math.round(width / fontWidth * 1.7));
    const adjustedLineHeight = Math.min(lineHeight, height / texts.length);
    const yLine1 = height / 2 - (texts.length / 2 * adjustedLineHeight);
    const textColor = props.textColor || "black";
    return (
        <g>
            <defs>
                <clipPath key={"rect"} id={"clip" + text}>
                    <rect
                        y={y}
                        x={x}
                        width={width}
                        height={height} />
                </clipPath>
            </defs>
            {
                texts.map((str, i) => React.createElement("text", {
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
                }, str))
            }
        </g>);
};
