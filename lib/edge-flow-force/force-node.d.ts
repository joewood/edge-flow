/// <reference types="react" />
import * as React from "react";
import { INode } from "./model";
import { Edge, IEdgeForceProps } from "./force-edge";
export interface INodeForceProps extends INode {
    children?: Edge[];
}
export declare class Node extends React.Component<INodeForceProps, any> {
    getLinks(): IEdgeForceProps[];
    render(): JSX.Element;
}
