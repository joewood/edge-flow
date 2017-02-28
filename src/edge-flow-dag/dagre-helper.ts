import * as React from "react";
const layout = require("ciena-dagre");
const Graph = require("ciena-graphlib").Graph;
import { keyBy } from "lodash";
import { IPoint } from "../edge-flow/model"
import { Edge, IEdgeDagProps } from "./dag-edge";
import { Node, INodeDagProps } from "./dag-node";

export interface IPosEdge {
    linkTo: string;
    p1: IPoint;
    p2: IPoint;
    p3: IPoint;
    p4: IPoint;
}

export interface IPosNode {
    x: number;
    y: number;
    id: string;
    edges: IPosEdge[];
}

type NodeProps = INodeDagProps & { links: IEdgeDagProps[] };

export function getGraphFromNodes(childrenNodes: React.ReactElement<INodeDagProps>[]): any {
    // Create a new directed graph 
    let g = new Graph()
        .setGraph({ rankdir: "LR" })
        .setDefaultEdgeLabel(function () { return {} })

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () { return {}; });
    const nodes: NodeProps[] = mapChild<INodeDagProps, any>(childrenNodes,
        props => ({
            ...props,
            label: props.label,
            width: 20,
            height: 15,
            links: mapChild<IEdgeDagProps, IEdgeDagProps>(props.children, cc => cc)
        }) as NodeProps);
    const nodeDict = keyBy(nodes, n => n.id);
    for (let node of nodes) {
        g.setNode(node.id, node);
        if (node.links) {
            for (let link of node.links) {
                if (!nodeDict[link.linkTo]) continue;
                g.setEdge(node.id, link.linkTo);
            }
        }
    }
    return g;
}

function mapChild<T, X>(children, f: (child: T) => X) {
    const childNodes = React.Children.map(children, (c: any) => c) || [];
    const nonNull = childNodes.filter(c => !!c).map(c => c.props as T);
    return nonNull.map(f);
}

export function getLayout(
    g: any,
    childrenNodes: React.ReactElement<INodeDagProps>[],
    width: number,
    height: number): IPosNode[] {
    g.rankdir = "LR";
    const forceLayout = layout.layout(g, { rankdir: "LR" }); 
    const nodes: any[] = g.nodes();
    const posNodes = nodes.map(node => {
        const pt = g.node(node);
        if (!pt) {
            console.error("Unknown Node ",node);
            return null;
        }
        return { id: node, x: pt.x, y: pt.y, edges: [] };
    }).filter(e => e);
    const posNodesDict = keyBy(posNodes, n => n.id);
    const edges = g.edges();
    for (let edge of edges) {
        const e = g.edge(edge);
        if (posNodesDict[edge.v]) {
            posNodesDict[edge.v].edges.push({
                linkTo: edge.w,
                p1: e.points[0],
                p2: e.points[1] || e.points[0],
                p3: e.points[2] || e.points[1] || e.points[0],
                p4: e.points.slice(-1)[0],
            });
        } else {
            console.error("edge in layout has missing source node",edge);
            debugger;
        }
    }
    return posNodes;
}
