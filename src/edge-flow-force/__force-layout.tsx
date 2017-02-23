import * as React from "react";

const graph = require("ngraph.graph");
import Flow, { Step } from "./flow";
import { Node, Link } from "./graph-node";
import {
    getPosition, getGraphFromNodes, getLayout, mapNodes,
    mapLinks, IPosLink, IPosNode, IPos
} from "./ngraph-helper"
import { WrappedSvgText } from "./svg-components"

export interface IEvent {
    nodeId: string;
    graph: { x: number, y: number };
    screen: { x: number, y: number };
}

interface IProps {
    text?: string;
    width: number;
    height: number;
    run?: boolean;
    selectedNodeId?: string;
    onClickNode?: (args: IEvent) => void;
    backgroundColor?: string;
    children?: Node[];
}


interface IState {
    nodes?: IPosNode[];
    links?: IPosLink[];
}

/** For a set of nodes, do a Forced based layout using the ngraph helpers.
 * @export
 * @class ForceLayout
 * @extends {React.Component<IProps, IState>}
  */
export class ForceLayout extends React.Component<IProps, IState> {
    constructor(p: IProps) {
        super(p);
        this.state = {...this.getStateFromProps(p)};
    }

    private getStateFromProps(newProps: IProps): IState {
        const graph = getGraphFromNodes(newProps.children as any);
        return getLayout(graph, newProps.children as any, newProps.width, newProps.height);
    }

    private componentWillReceiveProps(newProps: IProps) {
        this.setState(this.getStateFromProps(newProps));
    }

    public render() {
        const { nodes, links} = this.state;
        const { width, height, run, backgroundColor, onClickNode, selectedNodeId } = this.props;
        return (
            <div key="root" style={{ position: "relative", width: width, height: height, display: "inline-block", verticalAlign: "top" }}>
                <svg width={width} height={height} style={{ left: 0, top: 0, backgroundColor: backgroundColor, position: "absolute" }}
                    onClick={() => onClickNode({ nodeId: null, graph: null, screen: null })}
                    >
                    <g>{
                        links.filter(l => !isNaN(l.ratePerSecond) && (l.ratePerSecond > 0))
                            .map(l => <path
                                key={l.node.id + "--" + l.to}
                                d={`M${l.node.x} ${l.node.y} L${l.x} ${l.y}`}
                                stroke="#909090"
                                fill="transparent"
                                strokeWidth={2}
                                />)
                    }</g><g>{
                        nodes.map(n => <WrappedSvgText key={n.id}
                            x={n.x} y={n.y}
                            height={60} width={80} fontWeight={n.group ? 800 : 400}
                            text={`${n.id}`} lineHeight={14} fontWidth={12} textColor="#fff8f8" />)
                    }</g><g>{
                        nodes.filter(n => !n.group).map(n => <circle key={n.id}
                            cx={n.x + 10}
                            cy={n.y + 10}
                            onClick={(c) => {
                                console.log("CLOCK", c);
                                onClickNode({ nodeId: n.id, graph: { x: n.x, y: n.y }, screen: null });
                                c.stopPropagation();
                            } }
                            r={((selectedNodeId === n.id) ? 9 : 5)}
                            fill="#80ff80"
                            strokeWidth={(selectedNodeId === n.id) ? 3 : 0}
                            stroke={(selectedNodeId === n.id) ? "white" : "transparent"}
                            />)
                    }</g>
                </svg>
            </div>);
    }
}

