/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { groupBy, maxBy, minBy, flatten, values, keyBy, Dictionary } from "lodash";
import Color = require("color");


import { EdgeFlow, NodeClickEventArgs, IBaseProps } from "./edge-flow"
import { Edge, IEdgeProps } from "./edge-flow-force/force-edge";
import { Node, INodeProps } from "./edge-flow-force/force-node";

export { Edge, IEdgeProps, Node, INodeProps };

import {
    getPosition, getGraphFromNodes, getLayout, mapNodes,
    mapLinks, IPosLink, IPosNode, IPos
} from "./edge-flow-force/ngraph-helper"


export interface IProps extends IBaseProps {
    children?: Node[];
}

export interface IState {
    nodes?: IPosNode[];
    links?: IPosLink[];
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

export class EdgeFlowForce extends React.Component<IProps, IState> {

    constructor(p: IProps) {
        super(p);
        this.state = { ...this.getStateFromProps(p) };
    }

    private getStateFromProps(newProps: IProps): IState {
        const graph = getGraphFromNodes(newProps.children as any);
        return getLayout(graph, newProps.children as any, newProps.style.width, newProps.style.height);
    }

    private componentWillReceiveProps(newProps: IProps) {
        this.setState(this.getStateFromProps(newProps));
    }

    public render() {
        const state = this.state;
        const posNodes = keyBy(state.nodes, n => n.id);

        const {children, ...props} = this.props;
        const nodes = getChildrenProps<INodeProps>(children) || [];
        const nodeDict = keyBy(nodes, n => n.id);
        type EdgeAndNodeType = IEdgeProps & { from: INodeProps };
        const allEdges = nodes.reduce((p, node: INodeProps) => [
            ...p,
            ...(getChildrenProps<IEdgeProps>(node.children) || [])
                .filter(edge => !isNaN(edge.ratePerSecond) && (edge.ratePerSecond > 0))
                .map(l => ({ from: node, ...l } as EdgeAndNodeType))
        ], [] as EdgeAndNodeType[]);
        const groupedEdges = groupBy(allEdges, e => e.from.id);

        return (<EdgeFlow {...props}>
            {
                nodes.map(n => <Node key={n.id} x={posNodes[n.id].x} y={posNodes[n.id].y} {...n} >
                    {groupedEdges[n.id].map(e => <Edge key={e.from.id + "-" + e.linkTo} {...e} />)}
                </Node>)
            }
        </EdgeFlow>
        );
    }
}

