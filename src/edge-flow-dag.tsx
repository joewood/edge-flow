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

import { getGraphFromNodes, getLayout, IPosNode } from "./edge-flow-dag/dagre-helper"


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

export class EdgeFlowDag extends React.PureComponent<IProps, IState> {

    constructor(p: IProps) {
        super(p);
        this.state = { nodes: this.getStateFromProps(p) };
    }

    private getStateFromProps(newProps: IProps): IPosNode[] {
        const graph = getGraphFromNodes(newProps.children as any);
        return getLayout(graph, newProps.children as any, newProps.style.width, newProps.style.height);
    }

    private componentWillReceiveProps(newProps: IProps) {
        console.log("new Props");
        if (newProps.children !== this.props.children) {
            this.setState({ nodes: this.getStateFromProps(newProps) });
        }
    }

    public render() {
        const state = this.state;
        const posNodes = keyBy(state.nodes, n => n.id);
        const {children, ...props} = this.props;
        const nodes = getChildrenProps<INodeDagProps>(children) || [];
        console.log("Rendering DAG " + nodes.length);
        const nodeDict = keyBy(nodes, n => n.id);
        const posEdges = flatten(state.nodes.map(n => n.edges.map(e => ({ ...e, id: n.id }))));
        const edgeDict = keyBy(posEdges, e => e.id + "-" + e.linkTo)
        type EdgeAndNodeType = IEdgeDagProps & { fromForceNode: string };
        const allEdges = nodes.reduce((p, node) => [
            ...p,
            ...(getChildrenProps<IEdgeDagProps>(node.children))
                .map(edge => ({ fromForceNode: node.id, ...edge } as EdgeAndNodeType))
        ], [] as EdgeAndNodeType[]);
        const groupedEdges = groupBy(allEdges, e => e.fromForceNode);

        const round = (r: { x: number, y: number }) => ({ x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100 });
        return (<EdgeFlow {...props}>{
            nodes
                .map(node => (
                    <Node key={node.id} x={Math.round(posNodes[node.id].x * 100) / 100} y={Math.round(posNodes[node.id].y * 100) / 100} {...node} >
                        {groupedEdges[node.id] && groupedEdges[node.id].map(edge => {
                            const ee = edgeDict[node.id + "-" + edge.linkTo];
                            return <Edge key={edge.fromForceNode + "-" + edge.linkTo}
                                {...edge}
                                source={round(ee.p1)}
                                p2={round(ee.p2)}
                                p3={round(ee.p3)}
                                target={round(ee.p4)}
                            />;
                        })}
                    </Node>))
        }</EdgeFlow>
        );
    }
}

