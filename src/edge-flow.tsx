/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { maxBy, minBy, keyBy } from "lodash";
import { TransitionMotion } from "react-motion";
import Color = require("color");

import { WrappedSvgText } from "./edge-flow/svg-components"
import { ParticleCanvas, ParticleEdge } from "./edge-flow/particle-canvas";
import { Edge, IEdgeProps } from "./edge-flow/edge-flow-edge";
import { Node, INodeProps } from "./edge-flow/edge-flow-node";
// import { IPoint } from "./edge-flow/model";
import { getChildrenProps } from "./common"
import { EdgeStyle, EdgeAndNodeType, MotionStyle, createDefaultEdgeStyle, createDefaultNodeStyle, createEdgeStyle, createNodeStyle, isNodeStyles, isEdgeStyles } from "./animation-style"
import { Scale } from "./edge-flow/scale"

export { Edge, IEdgeProps, Node, INodeProps, };

// const oldSpring = _Spring;
// const spring = _Spring; //(v: number) => oldSpring(v, { damping: 10, stiffness: 80 });

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
        const { run, style, onClickNode, selectedNodeId } = this.props;
        const { backgroundColor, width, height } = style;
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
        const size = { width: diagramWidth, height: diagramHeight };
        if (nodes.length === 0) return <div />;

        const max = { x: maxBy(nodes, n => n.center.x).center.x, y: maxBy(nodes, n => n.center.y).center.y };
        const min = { x: minBy(nodes, n => n.center.x).center.x, y: minBy(nodes, n => n.center.y).center.y };

        const scale = new Scale(min, max, size, { width: 20, height: 20 });

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

        const svgLineFn = (styles: EdgeStyle[], scale: Scale) => {
            return styles
                .filter(style => !style.data.isNode)
                .map(edgeStyle => {
                    const style = edgeStyle.style;
                    const edge = edgeStyle.data;
                    return <path key={edgeStyle.key}
                        d={`M${style.p0x},${style.p0y} C ${style.p1x},${style.p1y} ${style.p2x},${style.p2y} ${style.p3x},${style.p3y}`}
                        stroke={edge.pathColor || defaulltStrokeColor}
                        opacity={edge.pathOpacity || 0.05}
                        fill="transparent"
                        strokeWidth={scale.sizeToScreen(edge.pathWidth || 4)}
                    />;
                });
        };


        const defaultStyles = [
            ...allEdges.map(edge => createDefaultEdgeStyle(edge, nodeDict, scale)),
            ...nodes.map(node => createDefaultNodeStyle(node, node.center, scale))
        ];
        const springStyles = [
            ...allEdges.map(edge => createEdgeStyle(edge, nodeDict, scale)),
            ...nodes.map(node => createNodeStyle(node, node.center, scale)
            )
        ];
        return (
            <div key="root" style={composedStyle} >
                <svg key="svg" width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}>
                    <TransitionMotion key="svg-anim" defaultStyles={defaultStyles} styles={springStyles}>{
                        (styles: MotionStyle[]) =>
                            <g key="g">{[
                                ...svgLineFn(isEdgeStyles(styles), scale),
                                ...isNodeStyles(styles)
                                    .filter(style => style.data.label)
                                    .map(nodeStyle =>
                                        <WrappedSvgText key={"TEXT-" + nodeStyle.key}
                                            x={nodeStyle.style.x - 25}
                                            y={nodeStyle.style.y+ 14}
                                            height={scale.heightToScreen(40)}
                                            width={scale.widthToScreen(50)}
                                            fontWeight={nodeStyle.data.group ? 800 : 400}
                                            text={`${nodeStyle.data.label}`}
                                            lineHeight={scale.heightToScreen(14)}
                                            fontWidth={scale.sizeToScreen(6)}
                                            textColor={nodeStyle.data.labelColor || "#fff8f8"} />),
                                ...isNodeStyles(styles)
                                    .filter(style => !style.data.group && !style.data.annotation)
                                    .map(nodeStyle =>
                                        nodeStyle.data.symbol
                                            ? <text key={"SYM-" + nodeStyle.key}
                                                x={nodeStyle.style.x} y={nodeStyle.style.y}
                                                height={scale.heightToScreen(24)} 
                                                width={scale.widthToScreen(80)}
                                                onClick={(c) => {
                                                    onClickNode({ nodeId: nodeStyle.key, graph: { x: nodeStyle.style.x, y: nodeStyle.style.y }, screen: null });
                                                    c.stopPropagation();
                                                }}
                                                style={{
                                                    fontFamily: nodeStyle.data.symbolFont || "FontAwesome",
                                                    fontSize: scale.sizeToScreen(nodeStyle.data.symbolSize || 20),
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
                                                r={scale.sizeToScreen(((selectedNodeId === nodeStyle.key) ? 9 : 5))}
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
                                    isEdgeStyles(styles)
                                        .map(edgeStyle =>
                                            <ParticleEdge key={edgeStyle.data.from.id + "-" + edgeStyle.data.linkTo}
                                                {...edgeStyle.data}
                                                size={scale.sizeToScreen(edgeStyle.data.size || 10)}
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

