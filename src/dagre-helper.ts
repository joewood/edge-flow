import * as React from "react";
import * as layout from "ciena-dagre";
import {Graph }from "ciena-graphlib";
import { keyBy } from "lodash";
import { IPoint } from "./model";
import { IEdgeDagProps, INodeDagProps } from "./edge-flow-dag-children";
import { mapChild } from "./common";

export interface IPosEdge {
    linkTo: string;
    p0: IPoint;
    p1: IPoint;
    p2: IPoint;
    p3: IPoint;
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
    let g = new Graph().setGraph({ rankdir: "LR" }).setDefaultEdgeLabel(function() {
        return {};
    });
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() {
        return {};
    });
    const nodes: NodeProps[] = mapChild<INodeDagProps, any>(
        childrenNodes,
        props =>
            ({
                id: props.id,
                width: (props.style && props.style.width) || 15,
                height: (props.style && props.style.height) || 15,
                links: mapChild<IEdgeDagProps, IEdgeDagProps>(props.children, cc => cc)
            } as NodeProps)
    );
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

export function getLayout(g: any): IPosNode[] {
    g.rankdir = "LR";
    layout.layout(g, { rankdir: "LR" });
    const nodes: any[] = g.nodes();
    const posNodes = nodes
        .map(node => {
            const pt = g.node(node);
            if (!pt) {
                console.error("Unknown Node ", node);
                return null;
            }
            return { id: node, x: pt.x, y: pt.y, edges: [] };
        })
        .filter(e => e);
    const posNodesDict = keyBy(posNodes, n => n.id);
    const edges = g.edges();
    for (let edge of edges) {
        const e = g.edge(edge);
        if (posNodesDict[edge.v]) {
            posNodesDict[edge.v].edges.push({
                linkTo: edge.w,
                p0: e.points[0],
                p1: e.points[1] || e.points[0],
                p2: e.points[2] || e.points[1] || e.points[0],
                p3: e.points.slice(-1)[0]
            });
        } else {
            console.error("edge in layout has missing source node", edge);
            debugger;
        }
    }
    return posNodes;
}
