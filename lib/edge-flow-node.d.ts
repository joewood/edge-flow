/// <reference types="react" />
import * as React from "react";
import { INode } from "./model";
import { Edge, IEdgeProps } from "./edge-flow-edge";
export interface INodeProps extends INode {
    children?: Edge[];
}
export declare class Node extends React.Component<INodeProps, any> {
    getLinks(): IEdgeProps[];
    render(): JSX.Element;
}
