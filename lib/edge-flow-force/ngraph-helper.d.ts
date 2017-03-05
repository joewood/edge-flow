/// <reference types="react" />
import * as React from "react";
import { INodeForceProps } from "./force-node";
export interface IPosNode {
    x: number;
    y: number;
    id: string;
}
export declare function getGraphFromNodes(childrenNodes: React.ReactElement<INodeForceProps>[]): any;
export declare function getLayout(g: any, childrenNodes: React.ReactElement<INodeForceProps>[]): IPosNode[];
export declare function mapLinks(graph: any, node?: any): any[];
export declare function mapNodes(graph: any): any[];
export declare function getPosition(layout: any, n: any): IPosNode;
