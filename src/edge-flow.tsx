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

export { Edge, IEdgeProps, Node, INodeProps };

const spring = _Spring; //(v: number) => oldSpring(v, { damping: 10, stiffness: 80 });

export interface NodeClickEventArgs {
    nodeId: string;
    graph: { x: number, y: number };
    screen: { x: number, y: number };
}

export interface IProps {
    // text?: string;
    run?: boolean;
    style: {
        width: number;
        height: number;
        backgroundColor?: string;
    }
    onClickNode?: (args: NodeClickEventArgs) => void;
    selectedNodeId?: string;
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
        const max = { x: maxBy(nodes, n => n.x).x*1.1, y: maxBy(nodes, n => n.y).y*1.1 };
        const min = { x: minBy(nodes, n => n.x).x*0.9, y: minBy(nodes, n => n.y).y*0.9 };

        const scaleX = (x: number) => ((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth;
        const scaleY = (y: number) => ((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight;

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

        const compKey = (edge:EdgeAndNodeType,suffix:"fromX"|"fromY"|"toX"|"toY") =>edge.from.id + "-" + edge.linkTo + "-" + suffix;

        const svgLineFn = style =>
            <g>{
                allEdges.map(edge => {
                    const styleX = style[compKey(edge,"fromX")];
                    const styleY = style[compKey(edge,"fromY")];
                    const styletoX = style[compKey(edge,"toX")];
                    const styletoY = style[compKey(edge,"toY")];
                    if (!styleX || !styleY || !styletoX || !styletoY) throw "Invalid Style";
                    return <path key={edge.from.id + "-" + edge.linkTo}
                        d={`M${styleX} ${styleY} L${styletoX} ${styletoY}`}
                        stroke={edge.pathColor || defaulltStrokeColor}
                        opacity={edge.pathOpacity || 0.1}
                        fill="transparent"
                        strokeWidth={edge.pathWidth || 12}
                    />;
                })
            }</g>;

        return (
            <div key="root" style={composedStyle} >
                <svg width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}>
                    <Motion defaultStyle={allEdges.reduce((p, edge) => ({
                        [compKey(edge,"fromX")]: scaleX(edge.from.x),
                        [compKey(edge,"fromY")]: scaleY(edge.from.y),
                        [compKey(edge,"toX")]: scaleX(nodeDict[edge.linkTo].x),
                        [compKey(edge,"toY")]: scaleY(nodeDict[edge.linkTo].y),
                        ...p
                    }), {})}
                        style={allEdges.reduce((p, edge) => ({
                            [compKey(edge,"fromX")]: spring(scaleX(edge.from.x)),
                            [compKey(edge,"fromY")]: spring(scaleY(edge.from.y)),
                            [compKey(edge,"toX")]: spring(scaleX(nodeDict[edge.linkTo].x)),
                            [compKey(edge,"toY")]: spring(scaleY(nodeDict[edge.linkTo].y)),
                            ...p
                        }), {})}>{svgLineFn}
                    </Motion>
                    <g>{
                        nodes.map(node => node.label && <Motion key={node.id}
                            defaultStyle={{ x: scaleX(node.x), y: scaleX(node.y) }}
                            style={{ x: spring(scaleX(node.x)), y: spring(scaleY(node.y)) }}>
                            {({x, y}) =>
                                <WrappedSvgText key={node.id}
                                    x={x} y={y}
                                    height={60} width={80} fontWeight={node.group ? 800 : 400}
                                    text={`${node.label}`} lineHeight={14} fontWidth={12}
                                    textColor={node.labelColor || "#fff8f8"} />
                            }</Motion>)
                    }</g>
                    <g>{
                        nodes.filter(node => !node.group && !node.annotation)
                            .map(node => node.symbol ? <text key={node.id}
                                x={scaleX(node.x)}
                                y={scaleY(node.y)}
                                height={20} width={80}
                                onClick={(c) => {
                                    // console.log("CLICK", c);
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
                                : <Motion key={node.id}
                                    defaultStyle={{ x: scaleX(node.x), y: scaleX(node.y) }}
                                    style={{ x: spring(scaleX(node.x)), y: spring(scaleY(node.y)) }}>
                                    {({x, y}) => <circle key={node.id}
                                        cx={x} cy={y}
                                        onClick={(c) => {
                                            // console.log("CLICK", c);
                                            onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                                            c.stopPropagation();
                                        }}
                                        r={((selectedNodeId === node.id) ? 9 : 5)}
                                        fill={node.symbolColor || "#80ff80"}
                                        strokeWidth={(selectedNodeId === node.id) ? 3 : 0}
                                        stroke={(selectedNodeId === node.id) ? "white" : "transparent"}
                                    />}
                                </Motion>
                            )
                    }</g>
                </svg>
                <div key="particleContainer"
                    style={{ pointerEvents: "none", position: "absolute", left: 0, top: 0 }}>
                    <Motion defaultStyle={allEdges.reduce((p, edge) => ({
                        [compKey(edge,"fromX")]: scaleX(edge.from.x) / width,
                        [compKey(edge,"fromY")]: 1 - scaleY(edge.from.y) / height,
                        [compKey(edge,"toX")]: scaleX(nodeDict[edge.linkTo].x) / width,
                        [compKey(edge,"toY")]: 1 - scaleY(nodeDict[edge.linkTo].y) / height,
                        ...p
                    }), {})}
                        style={allEdges.reduce((p, edge) => ({
                            [compKey(edge,"fromX")]: spring(scaleX(edge.from.x) / width),
                            [compKey(edge,"fromY")]: spring(1 - scaleY(edge.from.y) / height),
                            [compKey(edge,"toX")]: spring(scaleX(nodeDict[edge.linkTo].x) / width),
                            [compKey(edge,"toY")]: spring(1 - scaleY(nodeDict[edge.linkTo].y) / height),
                            ...p
                        }), {})}
                    >
                        {
                            (style) => <ParticleCanvas key="particles"
                                width={diagramWidth}
                                height={diagramHeight}
                                run={run}
                                backgroundColor={backgroundColor}>
                                {
                                    allEdges.map(edge =>
                                        <ParticleEdge key={edge.from.id + "-" + edge.linkTo}
                                            fromX={style[compKey(edge,"fromX")]}
                                            fromY={style[compKey(edge,"fromY")]}
                                            toX={style[compKey(edge,"toX")]}
                                            toY={style[compKey(edge,"toY")]}
                                            ratePerSecond={edge.ratePerSecond}
                                            {...edge} />
                                    )
                                }
                            </ParticleCanvas>
                        }
                    </Motion>
                </div>
            </div>
        );
    }
}

