import * as React from "react";
import { WrappedSvgText } from "./svg-components"
// import { EdgeStyle, EdgeAndNodeType, MotionStyle, createDefaultEdgeStyle, createDefaultNodeStyle, createEdgeStyle, createNodeStyle, isNodeStyles, isEdgeStyles } from "../animation-style"
import { NodeClickEventArgs, IPathStyle, IStyle, IPoint } from "../model"

const iconStyle = {
    userSelect: "none",
    cursor: "default",
    textAnchor: "middle",
    alignmentBaseline: "central",
    dominantBaseline: "central",
};

interface IEdgeLineProps {
    p0: IPoint;
    p1: IPoint;
    p2: IPoint;
    p3: IPoint;
    pathOpacity: number;
    strokeWidth: number;
    pathColor: string;
}

function EdgeLine(props: IEdgeLineProps) {
    return <path
        d={`M${props.p0.x},${props.p0.y} C ${props.p1.x},${props.p1.y} ${props.p2.x},${props.p2.y} ${props.p3.x},${props.p3.y}`}
        stroke={props.pathColor}
        opacity={props.pathOpacity || 0.05}
        fill="transparent"
        strokeWidth={props.strokeWidth}
    />;
}


export interface INodeStyle {
    key: string;
    labelStyle: IStyle;
    iconStyle: IStyle;
    icon: string;
    label: string;
    center: IPoint;
    filter?: string;
}

export interface IEdgeStyle {
    key: string;
    p0: IPoint;
    p1: IPoint;
    p2: IPoint;
    p3: IPoint;
    pathStyle: IPathStyle;
}

export interface IProps {
    nodes: INodeStyle[];
    edges: IEdgeStyle[];
    onClickNode?: (args: NodeClickEventArgs) => void;
}


export default function SvgGraph(props: IProps) {
    const { onClickNode, nodes, edges } = props;

    return <g key="g">{[
        ...edges.map(edge =>
            <EdgeLine key={edge.key}
                p0={edge.p0}
                p1={edge.p1}
                p2={edge.p2}
                p3={edge.p3}
                pathColor={edge.pathStyle.color}
                pathOpacity={edge.pathStyle.opacity}
                strokeWidth={edge.pathStyle.width}
            />),
        ...nodes.filter(node => node.label).map(node =>
            <WrappedSvgText key={node.key+"symbol"}
                x={node.center.x}
                y={node.center.y + 10}
                height={40}
                width={40}
                text={node.label}
                top
                center
                filter={node.filter}
                lineHeight={6}
                fontWidth={6}
                textColor={node.labelStyle.color}
            />),
        ...nodes.filter(node => !!node.icon).map(node =>
            <text key={node.key+"label"}
                x={node.center.x}
                y={node.center.y}
                height={20}
                width={20}
                onClick={(c) => {
                    onClickNode && onClickNode({ nodeId: node.key, graph: { x: node.center.x, y: node.center.y }, screen: null });
                    c.stopPropagation();
                }}
                filter={node.filter}
                style={{
                    ...iconStyle,
                    fontFamily: node.iconStyle.fontFamily,
                    fontSize: node.iconStyle.fontSize,
                    fill: node.iconStyle.color,
                    strokeWidth: 0,
                }}>{node.icon}</text>)
    ]}</g>
}
