/// <reference types="react" />
/** An attempt to create a text wrapped component for React Art.
 *  Text will written in the middle of the specified rectangle.
 */
export declare const WrappedSvgText: (props: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    center?: boolean;
    lineHeight: number;
    fontWidth: number;
    fontFamily?: string;
    fontWeight?: number;
    textColor?: string;
}) => JSX.Element;
