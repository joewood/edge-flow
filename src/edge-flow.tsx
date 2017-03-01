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
        const errorNodes = nodes.filter(n => n.x === undefined || isNaN(n.x) || n.y === undefined || isNaN(n.y));
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
        if (nodes.length === 0) return <div />;
        const max = { x: maxBy(nodes, n => n.x).x * 1.1, y: maxBy(nodes, n => n.y).y * 1.1 };
        const min = { x: minBy(nodes, n => n.x).x * 0.9, y: minBy(nodes, n => n.y).y * 0.9 };

        const scaleX = (x: number) => Math.round(((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth * 10) / 10;
        const scaleY = (y: number) => Math.round(((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight * 10) / 10;

        type EdgeAndNodeType = IEdgeProps & { from: INodeProps };

        const allEdges = nodes.reduce((p, node: INodeProps) => [
            ...p,
            ...(getChildrenProps<IEdgeProps>(node.children) || [])
                .filter(edge => !isNaN(edge.ratePerSecond) && (edge.ratePerSecond > 0))
                .map(l => ({ from: node, ...l } as EdgeAndNodeType))
        ], [] as EdgeAndNodeType[]);

        const missingEdges = allEdges.filter(l => !nodeDict[l.linkTo]);
        if (missingEdges.length > 0) {
            console.error("Edges with Missing targets", missingEdges);
            throw ("Missing Target");
        }

        const compKey = (edge: EdgeAndNodeType) => edge.from.id + "-" + edge.linkTo;

        type EdgeStyle = {
            key: string;
            style: {
                fromx?: number;
                fromy?: number;
                p2x?: number;
                p2y?: number;
                p3x?: number;
                p3y?: number;
                tox?: number;
                toy?: number;
                x?: number;
                y?: number;
            },
            data: EdgeAndNodeType & INodeProps;
        }

        const svgLineFn = (styles: EdgeStyle[]) => {
            return styles
                .filter(style => !!style.data.ratePerSecond)
                .map(edgeStyle => {
                    const d = edgeStyle.style;
                    const edge = edgeStyle.data;
                    return <path key={edgeStyle.key}
                        d={`M${d.fromx},${d.fromy} C ${d.p2x},${d.p2y} ${d.p3x},${d.p3y} ${d.tox},${d.toy}`}
                        stroke={edge.pathColor || defaulltStrokeColor}
                        opacity={edge.pathOpacity || 0.1}
                        fill="transparent"
                        strokeWidth={edge.pathWidth || 12}
                    />;
                });
        };

        const edgeStyle = (edge: EdgeAndNodeType, useSpring = false) => {
            const from = edge.source || edge.from;
            const to = edge.target || nodeDict[edge.linkTo];
            const p2 = edge.p2 || from;
            const p3 = edge.p3 || to;
            return {
                key: compKey(edge),
                style: {
                    fromx: useSpring ? spring(scaleX(from.x)) : scaleX(from.x),
                    fromy: useSpring ? spring(scaleY(from.y)) : scaleY(from.y),
                    tox: useSpring ? spring(scaleX(to.x)) : scaleX(to.x),
                    toy: useSpring ? spring(scaleY(to.y)) : scaleY(to.y),
                    p2x: useSpring ? spring(scaleX(p2.x)) : scaleX(p2.x),
                    p2y: useSpring ? spring(scaleY(p2.y)) : scaleY(p2.y),
                    p3x: useSpring ? spring(scaleX(p3.x)) : scaleX(p3.x),
                    p3y: useSpring ? spring(scaleY(p3.y)) : scaleY(p3.y),
                },
                data: edge
            } as EdgeStyle;
        }

        const nodeStyle = (node: INodeProps, point: IPoint) =>
            ({
                key: node.id,
                style: { x: spring(scaleX(point.x)), y: spring(scaleY(point.y)) },
                data: node
            });

        const defNodeStyle = (node: INodeProps, point: IPoint) =>
            ({
                key: node.id,
                style: { x: scaleX(point.x), y: scaleY(point.y) },
                data: node
            });

        const defaultStyles = [
            ...allEdges.map(edge => edgeStyle(edge)),
            ...nodes.map(node => defNodeStyle(node, { x: node.x, y: node.y }))
        ];
        const springStyles = [
            ...allEdges.map(edge => edgeStyle(edge, true)),
            ...nodes.map(node =>
                nodeStyle(node, { x: node.x, y: node.y })
            )
        ];
        return (
            <div key="root" style={composedStyle} >
                <svg key="svg" width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}>
                    <TransitionMotion key="svg-anim" defaultStyles={defaultStyles} styles={springStyles}>{
                        (styles: EdgeStyle[]) =>
                            <g key="g">{[
                                ...svgLineFn(styles),
                                ...styles
                                    .filter(style => style.data.label)
                                    .map(nodeStyle =>
                                        <WrappedSvgText key={"TEXT-" + nodeStyle.key}
                                            x={nodeStyle.style.x} y={nodeStyle.style.y}
                                            height={60} width={80} fontWeight={nodeStyle.data.group ? 800 : 400}
                                            text={`${nodeStyle.data.label}`}
                                            lineHeight={14}
                                            fontWidth={12}
                                            textColor={nodeStyle.data.labelColor || "#fff8f8"} />),
                                ...styles
                                    .filter(style => !style.data.ratePerSecond && !style.data.group && !style.data.annotation)
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
                        (styles: EdgeStyle[]) =>
                            <ParticleCanvas key="particles"
                                width={diagramWidth}
                                height={diagramHeight}
                                run={run}
                                backgroundColor={backgroundColor}>
                                {
                                    styles
                                        .filter(edge => edge.data.ratePerSecond)
                                        .map(edgeStyle =>
                                            <ParticleEdge key={compKey(edgeStyle.data)}
                                                {...edgeStyle.data}
                                                fromX={edgeStyle.style.fromx / diagramWidth}
                                                fromY={1 - edgeStyle.style.fromy / diagramHeight}
                                                toX={edgeStyle.style.tox / diagramWidth}
                                                toY={1 - edgeStyle.style.toy / diagramHeight}
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

