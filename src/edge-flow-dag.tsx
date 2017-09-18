/* 
 * Simple Edge Flow Drawing using Absolute Position of nodes
 * */

import * as React from "react";
import { groupBy, flatten, keyBy } from "lodash";
import * as equals from "equals";

import { EdgeFlow, Edge, Node, IBaseProps } from "./edge-flow";
import { EdgeDag, IEdgeDagProps, NodeDag, INodeDagProps } from "./edge-flow-dag-children";
import { getGraphFromNodes, getLayout, IPosNode } from "./dagre-helper";
import { getChildrenProps, mapChild } from "./common";

export { EdgeDag, IEdgeDagProps, NodeDag, INodeDagProps };

export interface IProps extends IBaseProps {
    children?: any;
}

export interface IState {
    nodes?: IPosNode[];
}

export class EdgeFlowDag extends React.PureComponent<IProps, IState> {
    constructor(p: IProps) {
        super(p);
        this.state = { nodes: this.getStateFromProps(p, true) };
    }

    private getStateFromProps(newProps: IProps, force = false): IPosNode[] {
        // for new props, we only want to calc the dag if the structure has changed
        type TrackChangesType = { width: number; height: number; links: { linkTo: string }[] };
        const newState = mapChild<INodeDagProps, TrackChangesType>(newProps.children, props => ({
            width: (props.style && props.style.width) || 15,
            height: (props.style && props.style.height) || 15,
            links: mapChild<IEdgeDagProps, { linkTo: string }>(props.children, ({ linkTo }) => ({ linkTo }))
        }));
        const oldState = mapChild<INodeDagProps, TrackChangesType>(this.props.children, props => ({
            width: (props.style && props.style.width) || 15,
            height: (props.style && props.style.height) || 15,
            links: mapChild<IEdgeDagProps, { linkTo: string }>(props.children, ({ linkTo }) => ({ linkTo }))
        }));
        if (force || !equals(newState, oldState)) {
            const graph = getGraphFromNodes(newProps.children as any);
            return getLayout(graph);
        } else {
            return this.state.nodes;
        }
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (newProps.children !== this.props.children) {
            this.setState({ nodes: this.getStateFromProps(newProps) });
        }
    }

    public render() {
        const state = this.state;
        const posNodes = keyBy(state.nodes, n => n.id);
        const { children, ...props } = this.props;
        const nodes = getChildrenProps<INodeDagProps>(children) || [];
        const nodeDict = keyBy(nodes, n => n.id);
        const posEdges = flatten(state.nodes.map(n => n.edges.map(e => ({ ...e, id: n.id }))));
        const edgeDict = keyBy(posEdges, e => e.id + "-" + e.linkTo);
        type EdgeAndNodeType = IEdgeDagProps & { fromForceNode: string };
        const allEdges = nodes.reduce(
            (p, node) => [
                ...p,
                ...getChildrenProps<IEdgeDagProps>(node.children).map(
                    edge => ({ fromForceNode: node.id, ...edge } as EdgeAndNodeType)
                )
            ],
            [] as EdgeAndNodeType[]
        );
        const groupedEdges = groupBy(allEdges, e => e.fromForceNode);

        return (
            <EdgeFlow {...props}>
                {nodes.map(node => (
                    <Node key={node.id} center={posNodes[node.id]} {...node}>
                        {groupedEdges[node.id] &&
                            groupedEdges[node.id].filter(edge => nodeDict[edge.linkTo]).map(edge => {
                                const ee = edgeDict[node.id + "-" + edge.linkTo];
                                const { fromForceNode, ...propse } = edge;
                                return (
                                    <Edge
                                        key={edge.fromForceNode + "-" + edge.linkTo}
                                        {...propse}
                                        p0={ee.p0}
                                        p1={ee.p1}
                                        p2={ee.p2}
                                        p3={ee.p3}
                                    />
                                );
                            })}
                    </Node>
                ))}
            </EdgeFlow>
        );
    }
}
