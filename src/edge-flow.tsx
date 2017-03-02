/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { maxBy, minBy, flatten, values, keyBy, Dictionary } from "lodash";
import { TransitionMotion, spring as _Spring } from "react-motion";
import Color = require("color");

import { WrappedSvgText } from "./edge-flow/svg-components"
import { ParticleCanvas, ParticleEdge } from "./edge-flow/particle-canvas";
import { Edge, IEdgeProps } from "./edge-flow/edge-flow-edge";
import { Node, INodeProps } from "./edge-flow/edge-flow-node";
import { IPoint } from "./edge-flow/model";

export { Edge, IEdgeProps, Node, INodeProps };

// const oldSpring = _Spring;
const spring = _Spring; //(v: number) => oldSpring(v, { damping: 10, stiffness: 80 });

export interface NodeClickEventArgs {
    nodeId: string;
    graph: { x: number, y: number };
    screen: { x: number, y: number };
}

// define a base set of props, as Component can reuse without children dependency
export interface IBaseProps {
    run?: boolean;
    style: {
        width: number;
        height: number;
        backgroundColor?: string;
    }
    nodeSize?: { width: number, height: number },
    onClickNode?: (args: NodeClickEventArgs) => void;
    selectedNodeId?: string;
}

export interface IProps extends IBaseProps {
    children?: Node[];
}

export interface IState {
}

const styles = {
    container: {
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        padding: 0,
        margin: 0
    } as React.CSSProperties
}

type EdgeAndNodeType = IEdgeProps & { from: INodeProps };


type MotionStyle = {
    key: string;
    style: {
        p0x?: number;
        p0y?: number;
        p1x?: number;
        p1y?: number;
        p2x?: number;
        p2y?: number;
        p3x?: number;
        p3y?: number;
        x?: number;
        y?: number;
    },
    data: EdgeAndNodeType & INodeProps & { isNode: boolean };
}

const compKey = (edge: EdgeAndNodeType) => edge.from.id + "-" + edge.linkTo;


const scaleX = (x: number, min: IPoint, max: IPoint, diagramWidth: number) => Math.round(((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth * 10) / 10;
const scaleY = (y: number, min: IPoint, max: IPoint, diagramHeight: number) => Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10;

function createEdgeStyle(edge: EdgeAndNodeType, nodeDict: Dictionary<INodeProps>, min: IPoint, max: IPoint, size: IPoint, useSpring = false): MotionStyle {
    // default values for lines- use source and target node
    const p0 = edge.p0 || edge.from.center;
    const p3 = edge.p3 || nodeDict[edge.linkTo].center;
    const p1 = edge.p1 || p0;
    const p2 = edge.p2 || p3;
    return {
        key: compKey(edge),
        style: {
            p0x: useSpring ? spring(scaleX(p0.x, min, max, size.x)) : scaleX(p0.x, min, max, size.x),
            p0y: useSpring ? spring(scaleY(p0.y, min, max, size.y)) : scaleY(p0.y, min, max, size.y),
            p1x: useSpring ? spring(scaleX(p1.x, min, max, size.x)) : scaleX(p1.x, min, max, size.x),
            p1y: useSpring ? spring(scaleY(p1.y, min, max, size.y)) : scaleY(p1.y, min, max, size.y),
            p2x: useSpring ? spring(scaleX(p2.x, min, max, size.x)) : scaleX(p2.x, min, max, size.x),
            p2y: useSpring ? spring(scaleY(p2.y, min, max, size.y)) : scaleY(p2.y, min, max, size.y),
            p3x: useSpring ? spring(scaleX(p3.x, min, max, size.x)) : scaleX(p3.x, min, max, size.x),
            p3y: useSpring ? spring(scaleY(p3.y, min, max, size.y)) : scaleY(p3.y, min, max, size.y),
        },
        data: { isNode: false, ...edge },
    } as MotionStyle;
}


function createNodeStyle(node: INodeProps, point: IPoint, min: IPoint, max: IPoint, size: IPoint, useSpring = false) {
    return {
        key: node.id,
        style: {
            x: useSpring ? spring(scaleX(point.x, min, max, size.x)) : scaleX(point.x, min, max, size.x),
            y: useSpring ? spring(scaleY(point.y, min, max, size.y)) : scaleY(point.y, min, max, size.y)
        },
        data: { isNode: true, ...node },
    } as MotionStyle;
}


/** Helper function, return the props of a children element */
function getChildrenProps<T>(children: React.ReactNode): T[] {
    return React.Children.map<T>(children, child => (child as any).props) || [];
}

export class EdgeFlow extends React.Component<IProps, IState> {

    constructor(p: IProps) {
        super(p);
        this.state = {};
    }

    public render() {
        const nodes = getChildrenProps<INodeProps>(this.props.children) || [];
        console.log("Rendering Edge Flow: " + nodes.length);
        const errorNodes = nodes.filter(n => n.center.x === undefined || isNaN(n.center.x) || n.center.y === undefined || isNaN(n.center.y));
        if (errorNodes.length > 0) {
            console.error("Missing X/Y", errorNodes);
            throw "Error Nodes";
        }
        const nodeDict = keyBy(nodes, n => n.id);
        const { run, children, style, onClickNode, selectedNodeId } = this.props;
        const { backgroundColor, width, height} = style;
        if (!width || isNaN(width) || !height || isNaN(height)) {
            throw "Invalid Height/Width";
        }

        const defaulltStrokeColor = Color(backgroundColor).lighten(10).toString();
        const diagramHeight = height;
        const diagramWidth = width;
        const composedStyle = {
            ...styles.container,
            ...style
        };
        const size = { x: diagramWidth, y: diagramHeight };
        if (nodes.length === 0) return <div />;
        const max = { x: maxBy(nodes, n => n.center.x).center.x * 1.1, y: maxBy(nodes, n => n.center.y).center.y * 1.1 };
        const min = { x: minBy(nodes, n => n.center.x).center.x * 0.9, y: minBy(nodes, n => n.center.y).center.y * 0.9 };

        const allEdges = nodes.reduce((p, node: INodeProps) => [
            ...p,
            ...(getChildrenProps<IEdgeProps>(node.children) || [])
                .map(l => ({ from: node, ...l } as EdgeAndNodeType))
        ], [] as EdgeAndNodeType[]);

        const missingEdges = allEdges.filter(l => !nodeDict[l.linkTo]);
        if (missingEdges.length > 0) {
            console.error("Edges with Missing targets", missingEdges);
            throw ("Missing Target");
        }

        const svgLineFn = (styles: MotionStyle[]) => {
            return styles
                .filter(style => !style.data.isNode)
                .map(edgeStyle => {
                    const style = edgeStyle.style;
                    const edge = edgeStyle.data;
                    return <path key={edgeStyle.key}
                        d={`M${style.p0x},${style.p0y} C ${style.p1x},${style.p1y} ${style.p2x},${style.p2y} ${style.p3x},${style.p3y}`}
                        stroke={edge.pathColor || defaulltStrokeColor}
                        opacity={edge.pathOpacity || 0.1}
                        fill="transparent"
                        strokeWidth={edge.pathWidth || 12}
                    />;
                });
        };



        const defaultStyles = [
            ...allEdges.map(edge => createEdgeStyle(edge, nodeDict, min, max, size, )),
            ...nodes.map(node => createNodeStyle(node, node.center, min, max, size))
        ];
        const springStyles = [
            ...allEdges.map(edge => createEdgeStyle(edge, nodeDict, min, max, size, true)),
            ...nodes.map(node => createNodeStyle(node, node.center, min, max, size, true)
            )
        ];
        return (
            <div key="root" style={composedStyle} >
                <svg key="svg" width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}>
                    <TransitionMotion key="svg-anim" defaultStyles={defaultStyles} styles={springStyles}>{
                        (styles: MotionStyle[]) =>
                            <g key="g">{[
                                ...svgLineFn(styles),
                                ...styles
                                    .filter(style => style.data.isNode && style.data.label)
                                    .map(nodeStyle =>
                                        <WrappedSvgText key={"TEXT-" + nodeStyle.key}
                                            x={nodeStyle.style.x} y={nodeStyle.style.y}
                                            height={60} width={80} fontWeight={nodeStyle.data.group ? 800 : 400}
                                            text={`${nodeStyle.data.label}`}
                                            lineHeight={14}
                                            fontWidth={12}
                                            textColor={nodeStyle.data.labelColor || "#fff8f8"} />),
                                ...styles
                                    .filter(style => style.data.isNode && !style.data.group && !style.data.annotation)
                                    .map(nodeStyle =>
                                        nodeStyle.data.symbol
                                            ? <text key={"SYM-" + nodeStyle.key}
                                                x={nodeStyle.style.x} y={nodeStyle.style.y}
                                                height={20} width={80}
                                                onClick={(c) => {
                                                    onClickNode({ nodeId: nodeStyle.key, graph: { x: nodeStyle.style.x, y: nodeStyle.style.y }, screen: null });
                                                    c.stopPropagation();
                                                }}
                                                style={{
                                                    fontFamily: nodeStyle.data.symbolFont || "FontAwesome",
                                                    fontSize: nodeStyle.data.symbolSize || 23,
                                                    textAnchor: "middle",
                                                    alignmentBaseline: "central",
                                                    dominantBaseline: "central",
                                                    fill: nodeStyle.data.symbolColor || "#fff8f8",
                                                    strokeWidth: 1,
                                                    stroke: "#303050",
                                                }}>{nodeStyle.data.symbol}</text>
                                            : <circle key={"SYM-" + nodeStyle.key}
                                                cx={nodeStyle.style.x} cy={nodeStyle.style.y}
                                                onClick={c => {
                                                    // console.log("CLICK", c);
                                                    onClickNode({ nodeId: nodeStyle.key, graph: { x: nodeStyle.style.x, y: nodeStyle.style.y }, screen: null });
                                                    c.stopPropagation();
                                                }}
                                                r={((selectedNodeId === nodeStyle.key) ? 9 : 5)}
                                                fill={nodeStyle.data.symbolColor || "#80ff80"}
                                                strokeWidth={(selectedNodeId === nodeStyle.key) ? 3 : 0}
                                                stroke={(selectedNodeId === nodeStyle.key) ? "white" : "transparent"}
                                            />)
                            ]}</g>}
                    </TransitionMotion>)
                </svg>
                <div key="particleContainer"
                    style={{ pointerEvents: "none", position: "absolute", left: 0, top: 0 }}>
                    <TransitionMotion key={"motion-anim"} defaultStyles={defaultStyles} styles={springStyles}>{
                        (styles: MotionStyle[]) =>
                            <ParticleCanvas key="particles"
                                width={diagramWidth}
                                height={diagramHeight}
                                run={run}
                                backgroundColor={backgroundColor}>
                                {
                                    styles
                                        .filter(style => !style.data.isNode)
                                        .map(edgeStyle =>
                                            <ParticleEdge key={compKey(edgeStyle.data)}
                                                {...edgeStyle.data}
                                                p0={{
                                                    x: edgeStyle.style.p0x / diagramWidth,
                                                    y: 1 - edgeStyle.style.p0y / diagramHeight
                                                }}
                                                p1={{
                                                    x: edgeStyle.style.p1x / diagramWidth,
                                                    y: 1 - edgeStyle.style.p1y / diagramHeight
                                                }}
                                                p2={{
                                                    x: edgeStyle.style.p2x / diagramWidth,
                                                    y: 1 - edgeStyle.style.p2y / diagramHeight
                                                }}
                                                p3={{
                                                    x: edgeStyle.style.p3x / diagramWidth,
                                                    y: 1 - edgeStyle.style.p3y / diagramHeight
                                                }}
                                            />)
                                }
                            </ParticleCanvas>}
                    </TransitionMotion>
                </div>
            </div >
        );
    }
}

