/// <reference types="react" />
import * as React from "react";
import { INode } from "./model";
import { Edge, IEdgeDagProps } from "./dag-edge";
export interface INodeDagProps extends INode {
    children?: Edge[];
}
export declare class Node extends React.Component<INodeDagProps, any> {
    getLinks(): IEdgeDagProps[];
    render(): JSX.Element;
}
