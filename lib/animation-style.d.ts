/// <reference types="lodash" />
import { Dictionary } from "lodash";
import { IPoint } from "./model";
import { INodeProps } from "./edge-flow-node";
import { IEdgeProps } from "./edge-flow-edge";
import { OpaqueConfig } from "react-motion";
import { Scale } from "./scale";
export interface EdgeStyleBase {
    key: string;
    data: EdgeAndNodeType & {
        isNode: boolean;
        isEdge: boolean;
    };
}
export interface EdgeStyle {
}
export interface EdgeStyle extends EdgeStyleBase {
    style: {
        p0x?: number;
        p0y?: number;
        p1x?: number;
        p1y?: number;
        p2x?: number;
        p2y?: number;
        p3x?: number;
        p3y?: number;
        pv0x?: number;
        pv0y?: number;
        pv1x?: number;
        pv1y?: number;
        pv2x?: number;
        pv2y?: number;
        pv3x?: number;
        pv3y?: number;
        scaleX?: number;
        scaleY?: number;
    };
}
export interface EdgeDefaultStyle extends EdgeStyleBase {
    style: {
        p0x?: OpaqueConfig;
        p0y?: OpaqueConfig;
        p1x?: OpaqueConfig;
        p1y?: OpaqueConfig;
        p2x?: OpaqueConfig;
        p2y?: OpaqueConfig;
        p3x?: OpaqueConfig;
        p3y?: OpaqueConfig;
        pv0x?: OpaqueConfig;
        pv0y?: OpaqueConfig;
        pv1x?: OpaqueConfig;
        pv1y?: OpaqueConfig;
        pv2x?: OpaqueConfig;
        pv2y?: OpaqueConfig;
        pv3x?: OpaqueConfig;
        pv3y?: OpaqueConfig;
    };
}
export interface NodeStyleBase {
    key: string;
    data: INodeProps & {
        isNode: boolean;
        isEdge: boolean;
    };
}
export interface NodeStyle extends NodeStyleBase {
    style: {
        x?: number;
        y?: number;
        xv?: number;
        yv?: number;
        scaleX?: number;
        scaleY?: number;
    };
}
export interface NodeDefaultStyle extends NodeStyleBase {
    style: {
        x?: OpaqueConfig;
        y?: OpaqueConfig;
        xv?: OpaqueConfig;
        yv?: OpaqueConfig;
    };
}
export declare type EdgeAndNodeType = IEdgeProps & {
    from: INodeProps;
};
export declare type MotionStyle = EdgeStyle | NodeStyle;
export declare function isNodeStyle(style: MotionStyle): style is NodeStyle;
export declare function isEdgeStyle(style: MotionStyle): style is EdgeStyle;
export declare function isEdgeStyles(styles: MotionStyle[]): EdgeStyle[];
export declare function isNodeStyles(styles: MotionStyle[]): NodeStyle[];
export declare function createEdgeStyle(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>, scale: Scale): EdgeStyle | EdgeDefaultStyle;
export declare function createDefaultEdgeStyle(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>, scale: Scale): EdgeStyle | EdgeDefaultStyle;
export declare function createNodeStyle(node: INodeProps, point: IPoint, scale: Scale): NodeStyle | NodeDefaultStyle;
export declare function createDefaultNodeStyle(node: INodeProps, point: IPoint, scale: Scale): NodeStyle | NodeDefaultStyle;
