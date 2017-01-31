/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { maxBy, minBy, flatten, values, keyBy, Dictionary } from "lodash";

import { Flow, Step } from "./flow";
import { Node, Edge, INodeProps, IEdgeProps, INode, IEdge } from "./flow-node";
export { Node, Edge, INode, IEdge, IEdgeProps, INodeProps } from "./flow-node";

import { WrappedSvgText } from "./svg-components"
import Color = require("color");
import { Motion, spring as _Spring } from "react-motion";
const spring = _Spring; //(v: number) => oldSpring(v, { damping: 10, stiffness: 80 });


export interface NodeClickEventArgs {
    nodeId: string;
    graph: { x: number, y: number };
    screen: { x: number, y: number };
}

export interface IProps {
    // text?: string;
    run?: boolean;
    style?: {
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
    private rootDiv: HTMLDivElement = null;

    constructor(p: IProps) {
        super(p);
        this.state = { width: 100, height: 100 };
    }

    private onResize = () => {
        if (this.rootDiv) this.setState({ width: this.rootDiv.clientWidth, height: this.rootDiv.clientHeight });
    }

    public render() {
        const nodes = getChildrenProps<INodeProps>(this.props.children) || [];
        const nodeDict = keyBy(nodes, n => n.id);
        const { /*width, height, */run, children, style, /*backgroundColor,*/ onClickNode, selectedNodeId } = this.props;
        const { backgroundColor, width, height} = style;

        const strokeColor = Color(backgroundColor).lighten(10).toString();
        const diagramHeight = height;
        const diagramWidth = width;
        const composedStyle = {
            ...styles.container,
            ...style
        };
        if (nodes.length === 0) return <div />;
        const max = { x: maxBy(nodes, n => n.x).x, y: maxBy(nodes, n => n.y).y };
        const min = { x: minBy(nodes, n => n.x).x, y: minBy(nodes, n => n.y).y };

        const scaleX = (x: number) => ((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth;
        const scaleY = (y: number) => ((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight;

        type EdgeAndNodeType = IEdgeProps & { from: INodeProps };

        const allLinks = nodes.reduce((p, node: INodeProps) => [
            ...p,
            ...(getChildrenProps<IEdgeProps>(node.children) || [])
                .filter(link => !isNaN(link.ratePerSecond) && (link.ratePerSecond > 0))
                .map(l => ({ from: node, ...l } as EdgeAndNodeType))
        ], [] as EdgeAndNodeType[]);

        const svgLineFn = style =>
            <g>{
                allLinks.map(link => <path key={link.from.id + "-" + link.linkTo}
                    d={`M${style[link.from.id + "-" + link.linkTo + "-fromX"]} ${style[link.from.id + "-" + link.linkTo + "-fromY"]} L${style[link.from.id + "-" + link.linkTo + "-toX"]} ${style[link.from.id + "-" + link.linkTo + "-toY"]}`}
                    stroke={strokeColor}
                    opacity={0.1}
                    fill="transparent"
                    strokeWidth={12}
                />)
            }</g>;

        return (
            <div key="root" style={composedStyle} >
                <svg width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}
                >
                    <Motion defaultStyle={allLinks.reduce((p, link) => ({
                        [link.from.id + "-" + link.linkTo + "-fromX"]: scaleX(link.from.x),
                        [link.from.id + "-" + link.linkTo + "-fromY"]: scaleY(link.from.y),
                        [link.from.id + "-" + link.linkTo + "-toX"]: scaleX(nodeDict[link.linkTo].x),
                        [link.from.id + "-" + link.linkTo + "-toY"]: scaleY(nodeDict[link.linkTo].y),
                        ...p
                    }), {})}
                        style={allLinks.reduce((p, link) => ({
                            [link.from.id + "-" + link.linkTo + "-fromX"]: spring(scaleX(link.from.x)),
                            [link.from.id + "-" + link.linkTo + "-fromY"]: spring(scaleY(link.from.y)),
                            [link.from.id + "-" + link.linkTo + "-toX"]: spring(scaleX(nodeDict[link.linkTo].x)),
                            [link.from.id + "-" + link.linkTo + "-toY"]: spring(scaleY(nodeDict[link.linkTo].y)),
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
                    <Motion defaultStyle={allLinks.reduce((p, link) => ({
                        [link.from.id + "-" + link.linkTo + "-fromX"]: scaleX(link.from.x) / width,
                        [link.from.id + "-" + link.linkTo + "-fromY"]: 1 - scaleY(link.from.y) / height,
                        [link.from.id + "-" + link.linkTo + "-toX"]: scaleX(nodeDict[link.linkTo].x) / width,
                        [link.from.id + "-" + link.linkTo + "-toY"]: 1 - scaleY(nodeDict[link.linkTo].y) / height,
                        ...p
                    }), {})}
                        style={allLinks.reduce((p, link) => ({
                            [link.from.id + "-" + link.linkTo + "-fromX"]: spring(scaleX(link.from.x) / width),
                            [link.from.id + "-" + link.linkTo + "-fromY"]: spring(1 - scaleY(link.from.y) / height),
                            [link.from.id + "-" + link.linkTo + "-toX"]: spring(scaleX(nodeDict[link.linkTo].x) / width),
                            [link.from.id + "-" + link.linkTo + "-toY"]: spring(1 - scaleY(nodeDict[link.linkTo].y) / height),
                            ...p
                        }), {})}
                    >
                        {
                            (style) => <Flow key="particles"
                                width={diagramWidth}
                                height={diagramHeight}
                                run={run}
                                backgroundColor={backgroundColor}>
                                {
                                    allLinks.map(link =>
                                        <Step key={link.from.id + "-" + link.linkTo}
                                            fromX={style[link.from.id + "-" + link.linkTo + "-fromX"]}
                                            fromY={style[link.from.id + "-" + link.linkTo + "-fromY"]}
                                            toX={style[link.from.id + "-" + link.linkTo + "-toX"]}
                                            toY={style[link.from.id + "-" + link.linkTo + "-toY"]}
                                            ratePerSecond={link.ratePerSecond}
                                            {...link} />
                                    )
                                }
                            </Flow>
                        }
                    </Motion>
                </div>
            </div>
        );
    }
}

