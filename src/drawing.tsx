/* 
 * Simple Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { maxBy, minBy, flatten, values, keyBy, Dictionary } from "lodash";

import { Flow, Step } from "./flow";
import { Node, Link, INodeProps, ILinkProps, INode, ILink } from "./drawing-node";

// re-exports
export { Node, Link, INode, ILink, ILinkProps, INodeProps } from "./drawing-node";

import { WrappedSvgText } from "./svg-components"
import Color = require("color");
import { Motion, spring as oldSpring } from "react-motion";
const spring = (v: number) => oldSpring(v, { damping: 10, stiffness: 80 });

export interface IEvent {
    nodeId: string;
    graph: { x: number, y: number };
    screen: { x: number, y: number };
}

export interface IProps {
    text?: string;
    width: number;
    height: number;
    run?: boolean;
    containerStyle?: React.CSSProperties;
    onClickNode?: (args: IEvent) => void;
    backgroundColor?: string;
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

/** For a ILink return the Path Line Element (<path d="M x y L x y"/>) */
function svgLineFromLink(nodeDict: Dictionary<INode>, linkFrom: INode, link: ILink, strokeColor: string,
    scaleX: (x: number) => number, scaleY: (y: number) => number) {
    if (!nodeDict[link.linkTo]) {
        console.error("Cannot find node referenced '" + link.linkTo + "'")
        return null;
    }
    const fn = function (p) {
        return <path
            key={linkFrom.id + "--" + link.linkTo}
            d={`M${p.fromx} ${p.fromy} L${p.tox} ${p.toy}`}
            stroke={strokeColor}
            opacity={0.1}
            fill="transparent"
            strokeWidth={12}
            />
    }

    const linkTo = nodeDict[link.linkTo];
    return React.createElement(Motion, {
        key: linkFrom.id + "--" + link.linkTo,
        defaultStyle: { fromx: 0, fromy: 0, tox: 0, toy: 0 },
        style: { fromx: spring(scaleX(linkFrom.x)), fromy: spring(scaleY(linkFrom.y)), tox: spring(scaleX(linkTo.x)), toy: spring(scaleY(linkTo.y)) }
    }, fn);
}

function flowStepFromLink(nodeDict: Dictionary<INode>,
    width: number, height: number,
    linkFrom: INode, link: ILink,
    scaleX: (x: number) => number, scaleY: (y: number) => number
): JSX.Element {
    if (!nodeDict[link.linkTo]) return null;
    const linkTo = nodeDict[link.linkTo];
    return <Motion key={linkFrom.id + "--" + link.linkTo}
        defaultStyle={{
            fromX: scaleX(linkFrom.x) / width,
            fromY: 1 - scaleY(linkFrom.y) / height,
            toX: scaleX(linkTo.x) / width,
            toY: 1 - scaleY(linkTo.y) / height
        }}
        style={{
            fromX: spring(scaleX(linkFrom.x) / width),
            fromY: spring(1 - scaleY(linkFrom.y) / height),
            toX: spring(scaleX(linkTo.x) / width),
            toY: spring(1 - scaleY(linkTo.y) / height)
        }}>
        {({fromX, fromY, toX, toY}) =>
            <Step key={linkFrom.id + "--" + link.linkTo}
                fromX={scaleX(linkFrom.x) / width} fromY={1 - scaleY(linkFrom.y) / height}
                toX={scaleX(linkTo.x) / width} toY={1 - scaleY(linkTo.y) / height}
                ratePerSecond={link.ratePerSecond}
                {...link} />
        }</Motion>
}

/** Helper function, return the props of a children element */
function getChildrenProps<T>(children: React.ReactNode): T[] {
    return React.Children.map<T>(children, child => (child as any).props);
}

export class Graph extends React.Component<IProps, IState> {
    constructor(p: IProps) {
        super(p);
        this.state = {};
    }

    public render() {
        const nodes = getChildrenProps<INodeProps>(this.props.children) || [];
        const nodeDict = keyBy(nodes, n => n.id);
        const { width, height, run, children, containerStyle, backgroundColor, onClickNode, selectedNodeId } = this.props;
        const strokeColor = Color(backgroundColor).lighten(10).toString();
        const diagramHeight = height;
        const diagramWidth = width;
        const style = {
            ...styles.container,
            ...containerStyle,
            width: diagramWidth,
            height: diagramHeight,
            backgroundColor: backgroundColor
        };
        if (nodes.length === 0) return <div />;
        const max = { x: maxBy(nodes, n => n.x).x, y: maxBy(nodes, n => n.y).y };
        const min = { x: minBy(nodes, n => n.x).x, y: minBy(nodes, n => n.y).y };

        const scaleX = (x: number) => ((x - min.x) + (max.x - min.x) * 0.08) / ((max.x - min.x) * 1.16) * diagramWidth;
        const scaleY = (y: number) => ((y - min.y) + (max.y - min.y) * 0.08) / ((max.y - min.y) * 1.16) * diagramHeight;

        type DDD = ILinkProps & { from: INodeProps };

        const allLinks = nodes.reduce<DDD[]>((p, node: INodeProps) => [
            ...p,
            ...getChildrenProps<ILinkProps>(node.children)
                .filter(link => !isNaN(link.ratePerSecond) && (link.ratePerSecond > 0))
                .map(l => ({ from: node, ...l } as DDD))
        ], [] as DDD[]);

        return (
            <div key="root" style={style}>
                <svg width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}
                    >
                    <g>{
                        nodes.reduce((p, node) =>
                            [...p,
                            getChildrenProps<ILinkProps>(node.children)
                                .filter(link => !isNaN(link.ratePerSecond) && (link.ratePerSecond > 0))
                                .map(link => svgLineFromLink(nodeDict, node, link, strokeColor, scaleX, scaleY))
                            ], [])
                    }</g>
                    <g>{
                        nodes.map(node => node.label && <Motion key={node.id}
                            defaultStyle={{ x: 0, y: 0 }}
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
                                    console.log("CLICK", c);
                                    onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                                    c.stopPropagation();
                                } }
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
                                    defaultStyle={{ x: 0, y: 0 }} style={{ x: spring(scaleX(node.x)), y: spring(scaleY(node.y)) }}>
                                    {({x, y}) => <circle key={node.id}
                                        cx={x} cy={y}
                                        onClick={(c) => {
                                            console.log("CLICK", c);
                                            onClickNode({ nodeId: node.id, graph: { x: node.x, y: node.y }, screen: null });
                                            c.stopPropagation();
                                        } }
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
                        }), {})}>
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

