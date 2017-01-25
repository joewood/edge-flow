/// <reference types="react" />
/** Given a text string and a maxium width, create several lines each no longer than width */
export declare function wrapText(text: string, maxWidth: number): string[];
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
