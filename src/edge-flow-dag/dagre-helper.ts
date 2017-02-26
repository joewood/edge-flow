import * as React from "react";
const layout = require("ciena-dagre");
const Graph = require("ciena-graphlib").Graph;
import { keyBy } from "lodash";

import { Edge, IEdgeDagProps } from "./dag-edge";
import { Node, INodeDagProps } from "./dag-node";

export interface IPosNode {
    x: number;
    y: number;
    id: string;
}

type NodeProps = INodeDagProps & { links: IEdgeDagProps[] };

export function getGraphFromNodes(childrenNodes: React.ReactElement<INodeDagProps>[]): any {
    // Create a new directed graph 
    let g = new Graph()
        .setGraph({rankdir:"LR"})
        .setDefaultEdgeLabel(function () { return {} })

    // Set an object for the graph label
    // g.setGraph({});

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () { return {}; });
    const nodes: NodeProps[] = mapChild<INodeDagProps, any>(childrenNodes,
        props => ({
            ...props,
            label: props.label,
            width: 30,
            height: 20,
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

export function getLayout(g: any, childrenNodes: React.ReactElement<INodeDagProps>[], width: number, height: number)
    : IPosNode[] {
    g.rankdir = "LR";
    const forceLayout = layout.layout(g, { rankdir: "LR" }); //,{ createSimulator: simulator});
    const nodes = g.nodes();
    return nodes.map(node => {
        const pt = g.node(node) && g.node(node);// && g.edge(edge).points[0];
        if (!pt) return null;
        return { id: node, x: pt.x, y: pt.y };
    }).filter(e => e);
}

export function mapLinks(graph: any, node?: any): any[] {
    const nn: any[] = [];
    if (node) {
        graph.forEachLinkedNode(node.id, l => {
            nn.push(l);
        });
    } else {
        graph.forEachLink(l => {
            nn.push(l);
        });
    }
    return nn;
}

export function mapNodes(graph: any): any[] {
    const nn: any[] = [];
    graph.forEachNode(n => {
        nn.push(n);
    });
    return nn;
}
