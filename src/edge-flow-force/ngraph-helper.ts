import * as React from "react";
const graph = require("ngraph.graph");
const layout = require('ngraph.forcelayout');
import { keyBy } from "lodash";

import { Edge, IEdgeProps } from "./force-edge";
import { Node, INodeProps } from "./force-node";

export interface IPos {
    x: number;
    y: number;
    id: string;
    to?: string;
    original?: {
        x: number;
        y: number;
    }
}

export type IPosLink = IPos & { node: IPosNode; to: string, ratePerSecond: number };
export type IPosNode = IPos & { text: string, links: IPosLink[], group?: boolean };

type NodeProps = INodeProps & { links: IEdgeProps[] };

export function getGraphFromNodes(childrenNodes: React.ReactElement<INodeProps>[]): any {
    let g = graph();
    const nodes: NodeProps[] = eachChild<INodeProps, any>(childrenNodes,
        props => ({
            ...props,
            text: props.label,
            links: eachChild<IEdgeProps, IEdgeProps>(props.children, cc => cc)
        }) as NodeProps);
    const nodeDict = keyBy(nodes, n => n.id);
    for (let node of nodes) {
        g.addNode(node.id, node);
        if (node.links) {
            for (let link of node.links) {
                if (!nodeDict[link.linkTo]) continue;
                g.addLink(node.id, link.linkTo, { ratePerSecond: link.ratePerSecond });
            }
        }
    }
    return g;
}

function eachChild<T, X>(children, f: (child: T) => X) {
    const nonNull = React.Children.map(children, (c: any) => c).filter(c => !!c).map(c => c.props as T);
    return nonNull.map(f);
}

export function getLayout(g: any, childrenNodes: React.ReactElement<INodeProps>[], width: number, height: number)
    : { nodes: IPosNode[], links: IPosLink[] } {
    const forceLayout = layout(g);
    eachChild<INodeProps, any>(childrenNodes, nodeProp => {
        if (!isNaN(nodeProp.x) && !isNaN(nodeProp.y)) {
            forceLayout.setNodePosition(nodeProp.id, nodeProp.x, nodeProp.y);
            if (nodeProp.fixed) {
                const node = g.getNode(nodeProp.id);
                forceLayout.pinNode(node, true);
            }
        }
        if (!isNaN(nodeProp.mass)) {
            console.log("Changing Mass");
            forceLayout.getBody(nodeProp.id).mass = nodeProp.mass;
        }
        eachChild<IEdgeProps, any>(nodeProp.children, linkProp => {
            if (!isNaN(linkProp.length) || nodeProp.group) {
                const spring = forceLayout.getSpring(nodeProp.id, linkProp.linkTo);
                if (spring) spring.length = linkProp.length || 6;
            }
        });
        return nodeProp;
    });
    const lockedNodes = mapNodes(g).filter(n => !!n.data.lockYTo || !!n.data.lockXTo);
    const nodeDict = keyBy(mapNodes(g), n => n.data.id);
    for (let i = 0; i < 100; ++i) {
        forceLayout.step();
        lockedNodes.forEach(locked => {
            let lockToPos = forceLayout.getNodePosition(locked.id);
            if (locked.data.lockYTo && nodeDict[locked.data.lockYTo]) {
                lockToPos.y = forceLayout.getNodePosition(locked.data.lockYTo).y;
            }
            if (locked.data.lockXTo && nodeDict[locked.data.lockXTo]) {
                lockToPos.x = forceLayout.getNodePosition(locked.data.lockXTo).x;
            }
            forceLayout.setNodePosition(locked.id, lockToPos.x, lockToPos.y);
        });
    }
    const rect = forceLayout.getGraphRect();

    const newNodes = mapNodes(g).map<IPosNode>(node => ({
        ...getPosition(forceLayout, node, rect, 20, width, height),
        text: node.data.text,
        group: node.data.group,
        links: []
    }));
    const newLinks = mapLinks(g).map<IPosLink>(l => ({
        ...getPosition(forceLayout, g.getNode(l.toId), rect, 20, width, height, true),
        to: l.toId,
        id: l.fromId,
        node: getPosition(forceLayout, g.getNode(l.fromId), rect, 20, width, height, true),
        ratePerSecond: l.data.ratePerSecond
    }) as IPosLink);
    return { nodes: newNodes, links: newLinks };
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

export function getPosition(layout: any, n: any, rect: any, blockWidth: number, screenWidth: number, screenHeight: number, center: boolean = false): IPos {
    // total width if the graph size + the block size + margin *2
    if (!n) {
        console.error("Invalid Node");
        return { x: 0, y: 0, id: null };
    }
    const width = rect.x2 - rect.x1 + blockWidth;
    const height = rect.y2 - rect.y1 + blockWidth;
    const scaleX = screenWidth / width;
    const scaleY = screenHeight / height;
    const offsetX = rect.x1 * -1 + blockWidth * 0.5;
    const offsetY = rect.y1 * -1 + blockWidth * 0.5;
    const pos = layout.getNodePosition(n.id);
    return {
        id: n.id,
        x: (pos.x + offsetX) * scaleX - (center ? 0 : blockWidth * 0.5),
        y: (pos.y + offsetY) * scaleY - (center ? 0 : blockWidth * 0.5),
        original: {
            x: pos.x,
            y: pos.y
        }
    };
}
