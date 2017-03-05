import { IPoint } from "./edge-flow/model";
import { maxBy, minBy, flatten, values, keyBy, Dictionary } from "lodash";
import { Node, INodeProps } from "./edge-flow/edge-flow-node";
import { Edge, IEdgeProps } from "./edge-flow/edge-flow-edge";
import { TransitionMotion, OpaqueConfig, spring } from "react-motion";

const scaleX = (x: number, min: IPoint, max: IPoint, diagramWidth: number) => Math.round(((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth * 10) / 10;
const scaleY = (y: number, min: IPoint, max: IPoint, diagramHeight: number) => Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10;

export interface EdgeStyleBase {
    key: string;
    data: EdgeAndNodeType & { isNode: boolean };
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
    }
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
    }
}

export interface NodeStyleBase {
    key: string;
    data: INodeProps & { isNode: boolean };
}

export interface NodeStyle extends NodeStyleBase {
    style: {
        x?: number;
        y?: number;
    }
}

export interface NodeDefaultStyle extends NodeStyleBase {
    style: {
        x?: OpaqueConfig;
        y?: OpaqueConfig;
    }
}

export type EdgeAndNodeType = IEdgeProps & { from: INodeProps };

export type MotionStyle = EdgeStyle | NodeStyle;
const compKey = (edge: EdgeAndNodeType) => edge.from.id + "-" + edge.linkTo;

export function isNodeStyle(style: MotionStyle): style is NodeStyle {
    return style.data.isNode;
}

export function isEdgeStyle(style: MotionStyle): style is EdgeStyle {
    return !style.data.isNode;
}

export function isEdgeStyles(styles: MotionStyle[]): EdgeStyle[] {
    return styles.reduce((p, s) => isEdgeStyle(s) ? [...p, s] : p, [] as EdgeStyle[]);
}

export function isNodeStyles(styles: MotionStyle[]): NodeStyle[] {
    return styles.reduce((p, s) => isNodeStyle(s) ? [...p, s] : p, [] as NodeStyle[]);
}

function getDefaultPositions(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>): { p0: IPoint, p1: IPoint, p2: IPoint, p3: IPoint } {
    return {
        p0: edge.p0 || edge.from.center,
        p1: edge.p1 || edge.p0 || edge.from.center,
        p2: edge.p2 || edge.p3 || nodeDict[edge.linkTo].center,
        p3: edge.p3 || nodeDict[edge.linkTo].center,
    }
}



export function createEdgeStyle(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>, min: IPoint, max: IPoint, size: IPoint): EdgeStyle | EdgeDefaultStyle {
    // default values for lines- use source and target node
    const { p0, p1, p2, p3 } = getDefaultPositions(edge, nodeDict);
    return {
        key: compKey(edge),
        style: {
            p0x: spring(scaleX(p0.x, min, max, size.x)),
            p0y: spring(scaleY(p0.y, min, max, size.y)),
            p1x: spring(scaleX(p1.x, min, max, size.x)),
            p1y: spring(scaleY(p1.y, min, max, size.y)),
            p2x: spring(scaleX(p2.x, min, max, size.x)),
            p2y: spring(scaleY(p2.y, min, max, size.y)),
            p3x: spring(scaleX(p3.x, min, max, size.x)),
            p3y: spring(scaleY(p3.y, min, max, size.y)),
        },
        data: { isNode: false, ...edge },
    };
}


export function createDefaultEdgeStyle(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>, min: IPoint, max: IPoint, size: IPoint): EdgeStyle | EdgeDefaultStyle {
    // default values for lines- use source and target node
    const { p0, p1, p2, p3 } = getDefaultPositions(edge, nodeDict);
    return {
        key: compKey(edge),
        style: {
            p0x: scaleX(p0.x, min, max, size.x),
            p0y: scaleY(p0.y, min, max, size.y),
            p1x: scaleX(p1.x, min, max, size.x),
            p1y: scaleY(p1.y, min, max, size.y),
            p2x: scaleX(p2.x, min, max, size.x),
            p2y: scaleY(p2.y, min, max, size.y),
            p3x: scaleX(p3.x, min, max, size.x),
            p3y: scaleY(p3.y, min, max, size.y),
        },
        data: { isNode: false, ...edge },
    };
}

export function createNodeStyle(node: INodeProps, point: IPoint, min: IPoint, max: IPoint, size: IPoint): NodeStyle | NodeDefaultStyle {
    return {
        key: node.id,
        style: {
            x: spring(scaleX(point.x, min, max, size.x)),
            y: spring(scaleY(point.y, min, max, size.y))
        },
        data: { isNode: true, ...node },
    };
}

export function createDefaultNodeStyle(node: INodeProps, point: IPoint, min: IPoint, max: IPoint, size: IPoint): NodeStyle | NodeDefaultStyle {
    return {
        key: node.id,
        style: {
            x: scaleX(point.x, min, max, size.x),
            y: scaleY(point.y, min, max, size.y)
        },
        data: { isNode: true, ...node },
    };
}

