import { Dictionary } from "lodash";
import { IPoint } from "./model";
import { INodeProps } from "./edge-flow-node";
import { IEdgeProps } from "./edge-flow-edge";
import { OpaqueConfig, spring } from "react-motion";
import { Scale } from "./scale"


export interface EdgeStyleBase {
    key: string;
    data: EdgeAndNodeType & { isNode: boolean, isEdge: boolean };
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
        pv0x?: OpaqueConfig;
        pv0y?: OpaqueConfig;
        pv1x?: OpaqueConfig;
        pv1y?: OpaqueConfig;
        pv2x?: OpaqueConfig;
        pv2y?: OpaqueConfig;
        pv3x?: OpaqueConfig;
        pv3y?: OpaqueConfig;
    }
}

export interface NodeStyleBase {
    key: string;
    data: INodeProps & { isNode: boolean; isEdge: boolean };
}

export interface NodeStyle extends NodeStyleBase {
    style: {
        x?: number;
        y?: number;
        xv?: number;
        yv?: number;
        scaleX?: number;
        scaleY?: number;
    }
}

export interface NodeDefaultStyle extends NodeStyleBase {
    style: {
        x?: OpaqueConfig;
        y?: OpaqueConfig;
        xv?: OpaqueConfig;
        yv?: OpaqueConfig;
    }
}

export type EdgeAndNodeType = IEdgeProps & { from: INodeProps };

export type MotionStyle = EdgeStyle | NodeStyle;
const compKey = (edge: EdgeAndNodeType) => edge.from.id + "-" + edge.linkTo;

export function isNodeStyle(style: MotionStyle): style is NodeStyle {
    return style.data.isNode;
}

export function isEdgeStyle(style: MotionStyle): style is EdgeStyle {
    return style.data.isEdge;
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

export function createEdgeStyle(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>, scale: Scale): EdgeStyle | EdgeDefaultStyle {
    // default values for lines- use source and target node
    const { p0, p1, p2, p3 } = getDefaultPositions(edge, nodeDict);
    return {
        key: compKey(edge),
        style: {
            p0x: spring(scale.scaleXToScreen(p0.x)),
            p0y: spring(scale.scaleYToScreen(p0.y)),
            p1x: spring(scale.scaleXToScreen(p1.x)),
            p1y: spring(scale.scaleYToScreen(p1.y)),
            p2x: spring(scale.scaleXToScreen(p2.x)),
            p2y: spring(scale.scaleYToScreen(p2.y)),
            p3x: spring(scale.scaleXToScreen(p3.x)),
            p3y: spring(scale.scaleYToScreen(p3.y)),
            pv0x: spring(p0.x),
            pv0y: spring(p0.y),
            pv1x: spring(p1.x),
            pv1y: spring(p1.y),
            pv2x: spring(p2.x),
            pv2y: spring(p2.y),
            pv3x: spring(p3.x),
            pv3y: spring(p3.y),
        },
        data: { isNode: false, isEdge: true, ...edge },
    };
}


export function createDefaultEdgeStyle(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>, scale: Scale/* min: IPoint, max: IPoint, size: IPoint*/): EdgeStyle | EdgeDefaultStyle {
    // default values for lines- use source and target node
    const { p0, p1, p2, p3 } = getDefaultPositions(edge, nodeDict);
    return {
        key: compKey(edge),
        style: {
            p0x: scale.scaleXToScreen(p0.x),
            p0y: scale.scaleYToScreen(p0.y),
            p1x: scale.scaleXToScreen(p1.x),
            p1y: scale.scaleYToScreen(p1.y),
            p2x: scale.scaleXToScreen(p2.x),
            p2y: scale.scaleYToScreen(p2.y),
            p3x: scale.scaleXToScreen(p3.x),
            p3y: scale.scaleYToScreen(p3.y),
            pv0x: p0.x,
            pv0y: p0.y,
            pv1x: p1.x,
            pv1y: p1.y,
            pv2x: p2.x,
            pv2y: p2.y,
            pv3x: p3.x,
            pv3y: p3.y,
        },
        data: { isNode: false, isEdge: true, ...edge },
    };
}

export function createNodeStyle(node: INodeProps, point: IPoint, scale: Scale/*min: IPoint, max: IPoint, size: IPoint*/): NodeStyle | NodeDefaultStyle {
    return {
        key: node.id,
        style: {
            x: spring(scale.scaleXToScreen(point.x)),
            y: spring(scale.scaleYToScreen(point.y)),
            xv: spring(point.x),
            yv: spring(point.y)
        },
        data: { isNode: true, isEdge: false, ...node },
    };
}

export function createDefaultNodeStyle(node: INodeProps, point: IPoint, scale: Scale): NodeStyle | NodeDefaultStyle {
    return {
        key: node.id,
        style: {
            x: scale.scaleXToScreen(point.x),
            y: scale.scaleYToScreen(point.y),
            xv: point.x,
            yv: point.y
        },
        data: { isNode: true, isEdge: false, ...node },
    };
}
