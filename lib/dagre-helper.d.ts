/// <reference types="react" />
import * as React from "react";
import { IPoint } from "./model";
import { INodeDagProps } from "./edge-flow-dag-children";
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
export declare function getGraphFromNodes(childrenNodes: React.ReactElement<INodeDagProps>[]): any;
export declare function getLayout(g: any): IPosNode[];
