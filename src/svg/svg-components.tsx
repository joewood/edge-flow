import React = require("react");
// import {Group, Surface, Text, Shape, Transform, LinearGradient, ClippingRectangle } from "react-art";

/** Given a text string and a maxium width, create several lines each no longer than width */
export function wrapText(text: string, maxWidth: number): string[] {
    let index = 0, nextIndex = 0;
    let ret = [] as string[];
    if (!text) { return []; }
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
    glow?: boolean;
    top?: boolean;
}) => {
    const { glow, top, text, height, width, center, x, y, lineHeight, fontWidth } = props;
    const texts = wrapText(text, Math.round(width / fontWidth * 1.7));
    const adjustedLineHeight = Math.min(lineHeight, height / texts.length);
    const yLine1 = top ? 0 : height / 2 - (texts.length / 2 * adjustedLineHeight);
    const textColor = props.textColor || "black";
    return (
        <g>
            <defs>
                <clipPath key={"rect"} id={"clip" + text}>
                    <rect
                        y={y}
                        x={x - (center ? (width / 2) : 0)}
                        width={width}
                        height={height} />
                </clipPath>
                <filter id="glow">
                    <feFlood result="flood" floodColor="#ffffff" floodOpacity="1"></feFlood>
                    <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"></feComposite>
                    <feMorphology in="mask" result="dilated" operator="dilate" radius="1.3"></feMorphology>
                    <feGaussianBlur in="dilated" result="blurred" stdDeviation="2"></feGaussianBlur>
                    <feMerge>
                        <feMergeNode in="blurred"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
            </defs>
            {
                texts.map((str, i) => React.createElement("text", {
                    key: "text" + i,
                    y: y + yLine1 + adjustedLineHeight * i,
                    x: x + 0,//(center ? (width / 2) : 4),
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
                    strokeWidth: glow ? 0 : 0.5,
                    stroke: glow ? "white" : "black",
                    filter: glow ? "url(#glow)" : undefined,
                    clipPath: "url(#clip" + text + ")",
                }, str))
            }
        </g>);
};
