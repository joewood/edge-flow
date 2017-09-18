/// <reference types="react" />
import * as React from "react";
import { IPositionlessEdge, IPositionlessNode } from "./model";
export interface INodeDagProps extends IPositionlessNode {
    children?: any;
}
export declare class NodeDag extends React.Component<INodeDagProps, any> {
    getLinks(): IEdgeDagProps[];
    render(): JSX.Element;
}
export interface IEdgeDagProps extends IPositionlessEdge {
}
export declare class EdgeDag extends React.Component<IEdgeDagProps, any> {
    render(): JSX.Element;
}
