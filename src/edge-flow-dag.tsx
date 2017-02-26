/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { groupBy, maxBy, minBy, flatten, values, keyBy, Dictionary } from "lodash";
import Color = require("color");

import { EdgeFlow, Edge, Node, NodeClickEventArgs, IBaseProps } from "./edge-flow"
import { Edge as EdgeDag, IEdgeDagProps } from "./edge-flow-dag/dag-edge";
import { Node as NodeDag, INodeDagProps } from "./edge-flow-dag/dag-node";

export { EdgeDag, IEdgeDagProps, NodeDag, INodeDagProps };

import {
    getGraphFromNodes, getLayout, mapNodes,
    mapLinks, IPosNode
} from "./edge-flow-dag/dagre-helper"


export interface IProps extends IBaseProps {
    children?: NodeDag[];
}

export interface IState {
    nodes?: IPosNode[];
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

export class EdgeFlowDag extends React.Component<IProps, IState> {

    constructor(p: IProps) {
        super(p);
        this.state = { nodes: this.getStateFromProps(p) };
    }

    private getStateFromProps(newProps: IProps): IPosNode[] {
        const graph = getGraphFromNodes(newProps.children as any);
        return getLayout(graph, newProps.children as any, newProps.style.width, newProps.style.height);
    }

    private componentWillReceiveProps(newProps: IProps) {
        this.setState({ nodes: this.getStateFromProps(newProps) });
    }

    public render() {
        const state = this.state;
        const posNodes = keyBy(state.nodes, n => n.id);
        const {children, ...props} = this.props;
        const nodes = getChildrenProps<INodeDagProps>(children) || [];
        const nodeDict = keyBy(nodes, n => n.id);
        type EdgeAndNodeType = IEdgeDagProps & { fromForceNode: string };
        const allEdges = nodes.reduce((p, node) => [
            ...p,
            ...(getChildrenProps<IEdgeDagProps>(node.children))
                .filter(edge => !isNaN(edge.ratePerSecond) && (edge.ratePerSecond > 0))
                .map(edge => ({ fromForceNode: node.id, ...edge } as EdgeAndNodeType))
        ], [] as EdgeAndNodeType[]);
        const groupedEdges = groupBy(allEdges, e => e.fromForceNode);
        return (<EdgeFlow {...props}>
            {
                nodes.map(node => <Node key={node.id} x={posNodes[node.id].x} y={posNodes[node.id].y} {...node} >
                    {groupedEdges[node.id] && groupedEdges[node.id].map(edge => <Edge key={edge.fromForceNode + "-" + edge.linkTo} {...edge} />)}
                </Node>)
            }
        </EdgeFlow>
        );
    }
}

