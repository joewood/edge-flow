/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { maxBy, minBy, flatten, values, keyBy, Dictionary } from "lodash";
import { Motion, spring as _Spring } from "react-motion";
import Color = require("color");

import { WrappedSvgText } from "./edge-flow/svg-components"
import { ParticleCanvas, ParticleEdge } from "./edge-flow/particle-canvas";
import { Edge, IEdgeProps } from "./edge-flow/edge-flow-edge";
import { Node, INodeProps } from "./edge-flow/edge-flow-node";
import { IPoint } from "./edge-flow/model";

export { Edge, IEdgeProps, Node, INodeProps };

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

        const scaleX = (x: number) => ((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16);
        const scaleY = (y: number) => ((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16);

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
            throw ("MIssing Target");
        }

        const compKey = (edge: EdgeAndNodeType, suffix: "to" | "from" | "p2" | "p3" | "source" | "target") => edge.from.id + "-" + edge.linkTo + "-" + suffix;

        const svgLineFn = style =>
            allEdges.map(edge => {
                const styleX = style[compKey(edge, "from") + "X"];
                const styleY = style[compKey(edge, "from") + "Y"];
                const styletoX = style[compKey(edge, "to") + "X"];
                const styletoY = style[compKey(edge, "to") + "Y"];
                if (!styleX || !styleY || !styletoX || !styletoY) throw "Invalid Style";
                return <path key={edge.from.id + "-" + edge.linkTo}
                    d={`M${styleX * diagramWidth} ${styleY * diagramHeight} L${styletoX * diagramWidth} ${styletoY * diagramHeight}`}
                    stroke={edge.pathColor || defaulltStrokeColor}
                    opacity={edge.pathOpacity || 0.1}
                    fill="transparent"
                    strokeWidth={edge.pathWidth || 12}
                />;
            });

        const edgeStyle = (edge: EdgeAndNodeType, edgePoint: IPoint, nodePoint: IPoint, prefix: "from" | "to" | "p2" | "p3", useSpring = false) =>
            (edgePoint )
                ? {
                    [compKey(edge, prefix) + "X"]: useSpring ? spring(scaleX(edgePoint.x)) : scaleX(edgePoint.x),
                    [compKey(edge, prefix) + "Y"]: useSpring ? spring(scaleY(edgePoint.y)) : scaleY(edgePoint.y)
                } : {
                    [compKey(edge, prefix) + "X"]: useSpring ? spring(scaleX(nodePoint.x)) : scaleX(nodePoint.x),
                    [compKey(edge, prefix) + "Y"]: useSpring ? spring(scaleY(nodePoint.y)) : scaleY(nodePoint.y)
                };

        const nodeStyle = (node: INodeProps, point: IPoint, prefix: string) =>
            ({
                [node.id + "-" + prefix + "X"]: spring(scaleX(point.x)),
                [node.id + "-" + prefix + "Y"]: spring(scaleY(point.y))
            });

        const defNodeStyle = (node: INodeProps, point: IPoint, prefix: string) =>
            ({
                [node.id + "-" + prefix + "X"]: scaleX(point.x),
                [node.id + "-" + prefix + "Y"]: scaleY(point.y)
            });

        const defaultStyle = {
            ...allEdges.reduce((p, edge) => ({
                ...edgeStyle(edge, edge.source, edge.from, "from"),
                ...edgeStyle(edge, edge.target, nodeDict[edge.linkTo], "to"),
                ...edgeStyle(edge, edge.p2, edge.from, "p2"),
                ...edgeStyle(edge, edge.p3, nodeDict[edge.linkTo], "p3"),
                ...p
            }), {}),
            ...nodes.reduce((p, node) => ({
                ...defNodeStyle(node, { x: node.x, y: node.y }, ""),
                ...p
            }), {})
        };
        const styleMotion = {
            ...allEdges.reduce((p, edge) => ({
                ...edgeStyle(edge, edge.source, edge.from, "from", true),
                ...edgeStyle(edge, edge.target, nodeDict[edge.linkTo], "to", true),
                ...edgeStyle(edge, edge.p2, edge.from, "p2", true),
                ...edgeStyle(edge, edge.p3, nodeDict[edge.linkTo], "p3", true),
                ...p
            }), {}),
            ...nodes.reduce((p, node) => ({
                ...nodeStyle(node, { x: node.x, y: node.y }, ""),
                ...p
            }), {})
        };

        return (
            <div key="root" style={composedStyle} >
                <svg width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}>
                    <Motion defaultStyle={defaultStyle} style={styleMotion}>{
                        style => <g>{[
                            ...svgLineFn(style),
                            ...nodes
                                .filter(node => node.label)
                                .map(node =>
                                    <WrappedSvgText key={"TEXT-" + node.id}
                                        x={style[node.id + "-X"] * diagramWidth} y={style[node.id + "-Y"] * diagramHeight}
                                        height={60} width={80} fontWeight={node.group ? 800 : 400}
                                        text={`${node.label}`} lineHeight={14} fontWidth={12}
                                        textColor={node.labelColor || "#fff8f8"} />),
                            ...nodes
                                .filter(node => !node.group && !node.annotation)
                                .map(node => node.symbol
                                    ? <text key={"SYM-" + node.id}
                                        x={style[node.id + "-X"] * diagramWidth} y={style[node.id + "-Y"] * diagramHeight}
                                        height={20} width={80}
                                        onClick={(c) => {
                                            onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                                            c.stopPropagation();
                                        }}
                                        style={{
                                            fontFamily: node.symbolFont || "FontAwesome",
                                            fontSize: node.symbolSize || 23,
                                            textAnchor: "middle",
                                            alignmentBaseline: "central",
                                            dominantBaseline: "central",
                                            fill: node.symbolColor || "#fff8f8",
                                            strokeWidth: 1,
                                            stroke: "#303050",
                                        }}>{node.symbol}</text>
                                    : <circle key={"SYM-" + node.id}
                                        cx={style[node.id + "-X"] * diagramWidth} cy={style[node.id + "-Y"] * diagramHeight}
                                        onClick={c => {
                                            // console.log("CLICK", c);
                                            onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                                            c.stopPropagation();
                                        }}
                                        r={((selectedNodeId === node.id) ? 9 : 5)}
                                        fill={node.symbolColor || "#80ff80"}
                                        strokeWidth={(selectedNodeId === node.id) ? 3 : 0}
                                        stroke={(selectedNodeId === node.id) ? "white" : "transparent"}
                                    />)
                        ]}</g>}
                    </Motion>)
                </svg>
                <div key="particleContainer"
                    style={{ pointerEvents: "none", position: "absolute", left: 0, top: 0 }}>
                    <Motion defaultStyle={defaultStyle} style={styleMotion}>{
                        style =>
                            <ParticleCanvas key="particles"
                                width={diagramWidth}
                                height={diagramHeight}
                                run={run}
                                backgroundColor={backgroundColor}>
                                {
                                    allEdges.map(edge =>
                                        <ParticleEdge key={edge.from.id + "-" + edge.linkTo}
                                            {...edge}

                                            fromX={style[compKey(edge, "from") + "X"]}
                                            fromY={1 - style[compKey(edge, "from") + "Y"]}
                                            toX={style[compKey(edge, "to") + "X"]}
                                            toY={1 - style[compKey(edge, "to") + "Y"]}
                                            p2={{
                                                x: style[compKey(edge, "p2") + "X"],
                                                y: 1 - style[compKey(edge, "p2") + "Y"]
                                            }}
                                            p3={{
                                                x: style[compKey(edge, "p3") + "X"],
                                                y: 1 - style[compKey(edge, "p3") + "Y"]
                                            }}
                                            ratePerSecond={edge.ratePerSecond}
                                        />
                                    )
                                }
                            </ParticleCanvas>}
                    </Motion>
                </div>
            </div >
        );
    }
}

