/// <reference types="react" />
import * as React from "react";
import { IPoint } from "../edge-flow/model";
import { INodeDagProps } from "./dag-node";
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
export declare function getGraphFromNodes(childrenNodes: React.ReactElement<INodeDagProps>[]): any;
export declare function getLayout(g: any, childrenNodes: React.ReactElement<INodeDagProps>[], width: number, height: number): IPosNode[];
