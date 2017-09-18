/// <reference types="react" />
import * as React from "react";
import { INode, IEdge } from "./model";
export interface IEdgeProps extends IEdge {
}
export declare class Edge extends React.Component<IEdgeProps, any> {
    render(): JSX.Element;
}
export interface INodeProps extends INode {
    children?: any;
}
export declare class Node extends React.Component<INodeProps, any> {
    getLinks(): IEdgeProps[];
    render(): JSX.Element;
}
